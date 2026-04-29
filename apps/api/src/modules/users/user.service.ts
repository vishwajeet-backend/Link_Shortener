import { randomBytes } from "crypto";
import { StatusCodes } from "http-status-codes";
import { EMAIL_VERIFICATION_TOKEN_TTL_HOURS } from "../../config/constants";
import { env } from "../../config/env";
import { userRepository } from "../../repositories/user.repository";
import { sendEmail } from "../../utils/email";
import { buildVerificationEmail } from "../../utils/email-templates";
import { hashPassword, hashToken, verifyPassword } from "../../utils/hash";
import type { UpdatePasswordInput, UpdateProfileInput, UserProfile } from "./user.types";

type ServiceError = Error & { statusCode?: number };

const buildServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

const createOneTimeToken = (): string => randomBytes(32).toString("hex");

const getFutureDateByHours = (hours: number): Date => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  return date;
};

export class UserService {
  async getModuleHealth(): Promise<{ module: string; status: string }> {
    return { module: "users", status: "ready-for-implementation" };
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw buildServiceError("User not found", StatusCodes.NOT_FOUND);
    }

    return this.toProfile(user);
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile> {
    let user = await userRepository.findById(userId);
    if (!user) {
      throw buildServiceError("User not found", StatusCodes.NOT_FOUND);
    }

    const profilePatch: { name?: string; avatarUrl?: string } = {};
    if (input.name !== undefined) {
      profilePatch.name = input.name.trim();
    }
    if (input.avatarUrl !== undefined) {
      profilePatch.avatarUrl = input.avatarUrl.trim();
    }
    if (Object.keys(profilePatch).length > 0) {
      const partial = await userRepository.updateProfile(userId, profilePatch);
      if (!partial) {
        throw buildServiceError("User not found", StatusCodes.NOT_FOUND);
      }
      user = partial;
    }

    const nextEmail = input.email?.trim().toLowerCase();
    const wantsEmailChange =
      nextEmail !== undefined && nextEmail.length > 0 && nextEmail !== user.email.toLowerCase();

    if (!wantsEmailChange) {
      if (Object.keys(profilePatch).length === 0) {
        throw buildServiceError("At least one field must be provided", StatusCodes.BAD_REQUEST);
      }
      return this.toProfile(user);
    }

    if (!input.currentPassword) {
      throw buildServiceError("Current password is required to change email", StatusCodes.BAD_REQUEST);
    }

    const passwordOk = await verifyPassword(input.currentPassword, user.passwordHash);
    if (!passwordOk) {
      throw buildServiceError("Current password is incorrect", StatusCodes.UNAUTHORIZED);
    }

    const taken = await userRepository.findByEmail(nextEmail);
    if (taken && taken.id !== userId) {
      throw buildServiceError("Email is already in use", StatusCodes.CONFLICT);
    }

    const verificationToken = createOneTimeToken();
    const tokenHash = hashToken(verificationToken);
    const expiresAt = getFutureDateByHours(EMAIL_VERIFICATION_TOKEN_TTL_HOURS);
    const snapshot = { email: user.email, isEmailVerified: user.isEmailVerified };

    const updated = await userRepository.updateEmailReverify(
      userId,
      nextEmail,
      tokenHash,
      expiresAt,
      false
    );
    if (!updated) {
      throw buildServiceError("User not found", StatusCodes.NOT_FOUND);
    }

    const link = `${env.CLIENT_ORIGIN}/auth/verify-email?token=${encodeURIComponent(verificationToken)}`;
    const mail = buildVerificationEmail(updated.name, link);
    try {
      await sendEmail({ to: nextEmail, subject: mail.subject, html: mail.html, text: mail.text });
    } catch (err) {
      await userRepository.revertEmailSnapshot(userId, snapshot);
      console.error("profile email change: verification email failed", err);
      throw buildServiceError(
        "We could not send a verification email. Your email was not changed. Check SMTP settings or try again later.",
        StatusCodes.BAD_GATEWAY
      );
    }

    return this.toProfile(updated);
  }

  async updatePassword(userId: string, input: UpdatePasswordInput): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw buildServiceError("User not found", StatusCodes.NOT_FOUND);
    }

    const matches = await verifyPassword(input.currentPassword, user.passwordHash);
    if (!matches) {
      throw buildServiceError("Current password is incorrect", StatusCodes.UNAUTHORIZED);
    }

    const nextHash = await hashPassword(input.newPassword);
    await userRepository.updatePassword(userId, nextHash);
  }

  private toProfile(user: Awaited<ReturnType<typeof userRepository.findById>>): UserProfile {
    if (!user) {
      throw buildServiceError("User not found", StatusCodes.NOT_FOUND);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}

export const userService = new UserService();
