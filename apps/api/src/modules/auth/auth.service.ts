import { StatusCodes } from "http-status-codes";
import { randomBytes } from "crypto";
import type { HydratedDocument } from "mongoose";
import { env } from "../../config/env";
import type { UserDocument } from "../../models/user.model";
import { userRepository } from "../../repositories/user.repository";
import { ROLES, USER_STATUS } from "../../types/common";
import { hashPassword, hashToken, verifyPassword } from "../../utils/hash";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../../utils/jwt";
import type {
  AuthenticatedUser,
  AuthTokens,
  LoginInput,
  GoogleLoginInput,
  LogoutInput,
  RefreshInput,
  RegisterInput
} from "./auth.types";

type ServiceError = Error & { statusCode?: number };

const buildServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

const getFutureDateByDays = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: AuthenticatedUser; tokens: AuthTokens }> {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw buildServiceError("Email is already registered", StatusCodes.CONFLICT);
    }

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.createUser({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: ROLES.USER
    });

    const tokens = this.createTokenPair(user.id, user.role);
    this.attachHashedRefreshToken(user, tokens.refreshToken);
    await user.save();

    return { user: this.toAuthenticatedUser(user), tokens };
  }

  async login(input: LoginInput): Promise<{ user: AuthenticatedUser; tokens: AuthTokens }> {
    const user = await userRepository.findByEmail(input.email.toLowerCase());
    if (!user) {
      throw buildServiceError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const isValidPassword = await verifyPassword(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw buildServiceError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    if (user.status === USER_STATUS.BANNED) {
      throw buildServiceError("User account is banned", StatusCodes.FORBIDDEN);
    }

    if (user.status === USER_STATUS.DELETED) {
      throw buildServiceError("User account is deleted", StatusCodes.FORBIDDEN);
    }

    return this.issueSessionForUser(user);
  }

  async loginWithGoogle(
    input: GoogleLoginInput
  ): Promise<{ user: AuthenticatedUser; tokens: AuthTokens }> {
    let user = await userRepository.findByGoogleId(input.googleId);
    if (!user) {
      user = await userRepository.findByEmail(input.email);
    }

    if (!user) {
      const generatedPasswordHash = await hashPassword(randomBytes(24).toString("hex"));
      user = await userRepository.createUser({
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash: generatedPasswordHash,
        role: ROLES.USER,
        authProvider: "GOOGLE",
        googleId: input.googleId,
        avatarUrl: input.avatarUrl
      });
    } else {
      user.authProvider = "GOOGLE";
      user.googleId = input.googleId;
      user.avatarUrl = input.avatarUrl;
    }

    if (user.status === USER_STATUS.BANNED) {
      throw buildServiceError("User account is banned", StatusCodes.FORBIDDEN);
    }

    if (user.status === USER_STATUS.DELETED) {
      throw buildServiceError("User account is deleted", StatusCodes.FORBIDDEN);
    }

    return this.issueSessionForUser(user);
  }

  async refresh(input: RefreshInput): Promise<AuthTokens> {
    let decoded: ReturnType<typeof verifyRefreshToken>;
    try {
      decoded = verifyRefreshToken(input.refreshToken);
    } catch (_error) {
      throw buildServiceError("Refresh token is invalid or expired", StatusCodes.UNAUTHORIZED);
    }
    const incomingTokenHash = hashToken(input.refreshToken);

    const user = await userRepository.findByIdWithRefreshToken(decoded.userId, incomingTokenHash);
    if (!user) {
      throw buildServiceError("Refresh token is invalid or expired", StatusCodes.UNAUTHORIZED);
    }

    user.refreshTokens = user.refreshTokens.map((token) =>
      token.tokenHash === incomingTokenHash
        ? { ...token, revokedAt: new Date() }
        : token
    );

    const nextTokens = this.createTokenPair(user.id, user.role);
    this.attachHashedRefreshToken(user, nextTokens.refreshToken);
    await user.save();

    return nextTokens;
  }

  async logout(userId: string, input: LogoutInput): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      return;
    }

    const targetHash = hashToken(input.refreshToken);
    user.refreshTokens = user.refreshTokens.map((token) =>
      token.tokenHash === targetHash && !token.revokedAt
        ? { ...token, revokedAt: new Date() }
        : token
    );

    await user.save();
  }

  async me(userId: string): Promise<AuthenticatedUser> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw buildServiceError("Authenticated user not found", StatusCodes.NOT_FOUND);
    }

    return this.toAuthenticatedUser(user);
  }

  private async issueSessionForUser(
    user: HydratedDocument<UserDocument>
  ): Promise<{ user: AuthenticatedUser; tokens: AuthTokens }> {
    const tokens = this.createTokenPair(user.id, user.role);
    this.attachHashedRefreshToken(user, tokens.refreshToken);
    user.lastLoginAt = new Date();
    await user.save();

    return { user: this.toAuthenticatedUser(user), tokens };
  }

  private createTokenPair(userId: string, role: AuthenticatedUser["role"]): AuthTokens {
    return {
      accessToken: signAccessToken({ userId, role }),
      refreshToken: signRefreshToken({ userId })
    };
  }

  private attachHashedRefreshToken(
    user: HydratedDocument<UserDocument>,
    refreshToken: string
  ): void {
    const now = new Date();
    const tokenHash = hashToken(refreshToken);
    const expiresAt = getFutureDateByDays(env.JWT_REFRESH_EXPIRES_IN_DAYS);

    const activeTokens = user.refreshTokens.filter(
      (token) => !token.revokedAt && token.expiresAt > now
    );

    user.refreshTokens = [
      ...activeTokens,
      {
        tokenHash,
        createdAt: now,
        expiresAt
      }
    ].slice(-10);
  }

  private toAuthenticatedUser(
    user: HydratedDocument<UserDocument>
  ): AuthenticatedUser {
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }
}

export const authService = new AuthService();
