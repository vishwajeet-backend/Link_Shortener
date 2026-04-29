import { HydratedDocument, Types } from "mongoose";
import { UserModel, type UserDocument } from "../models/user.model";
import { USER_STATUS, type Role, type UserStatus } from "../types/common";

type UserEntity = HydratedDocument<UserDocument>;

export class UserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    return UserModel.findOne({ email }).exec();
  }

  async createUser(input: {
    name: string;
    email: string;
    passwordHash: string;
    role: Role;
    authProvider?: "LOCAL" | "GOOGLE";
    googleId?: string;
    avatarUrl?: string;
  }): Promise<UserEntity> {
    return UserModel.create({
      name: input.name,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
      authProvider: input.authProvider,
      googleId: input.googleId,
      avatarUrl: input.avatarUrl
    });
  }

  async findByGoogleId(googleId: string): Promise<UserEntity | null> {
    return UserModel.findOne({ googleId }).exec();
  }

  async findByEmailVerificationToken(tokenHash: string): Promise<UserEntity | null> {
    return UserModel.findOne({
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpiresAt: { $gt: new Date() }
    }).exec();
  }

  async findByPasswordResetToken(tokenHash: string): Promise<UserEntity | null> {
    return UserModel.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpiresAt: { $gt: new Date() }
    }).exec();
  }

  async findById(userId: string): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;
    return UserModel.findById(userId).exec();
  }

  async findByIdWithRefreshToken(userId: string, tokenHash: string): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;

    return UserModel.findOne({
      _id: userId,
      refreshTokens: {
        $elemMatch: {
          tokenHash,
          revokedAt: { $exists: false },
          expiresAt: { $gt: new Date() }
        }
      }
    }).exec();
  }

  async listUsers(input: {
    page: number;
    limit: number;
    status?: UserStatus;
    role?: Role;
    search?: string;
  }): Promise<{ data: UserEntity[]; total: number }> {
    const filter: Record<string, unknown> = {};
    if (input.status) {
      filter.status = input.status;
    }
    if (input.role) {
      filter.role = input.role;
    }
    if (input.search) {
      const regex = new RegExp(input.search, "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const skip = (input.page - 1) * input.limit;
    const [data, total] = await Promise.all([
      UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(input.limit).exec(),
      UserModel.countDocuments(filter)
    ]);

    return { data, total };
  }

  async updateStatus(userId: string, status: UserStatus): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;

    const update: Record<string, unknown> = { status };
    if (status === USER_STATUS.BANNED || status === USER_STATUS.DELETED) {
      update.refreshTokens = [];
    }

    return UserModel.findByIdAndUpdate(userId, { $set: update }, { new: true }).exec();
  }

  async updateRole(userId: string, role: Role): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;
    return UserModel.findByIdAndUpdate(userId, { $set: { role } }, { new: true }).exec();
  }

  async updateProfile(userId: string, input: { name?: string; avatarUrl?: string }): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;
    return UserModel.findByIdAndUpdate(userId, { $set: input }, { new: true }).exec();
  }

  async updatePassword(userId: string, passwordHash: string): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;
    return UserModel.findByIdAndUpdate(userId, { $set: { passwordHash } }, { new: true }).exec();
  }

  async updateEmailVerification(userId: string, input: {
    tokenHash: string | null;
    expiresAt: Date | null;
    isEmailVerified?: boolean;
  }): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;

    return UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          emailVerificationTokenHash: input.tokenHash,
          emailVerificationExpiresAt: input.expiresAt,
          ...(input.isEmailVerified !== undefined
            ? { isEmailVerified: input.isEmailVerified }
            : {})
        }
      },
      { new: true }
    ).exec();
  }

  async updateEmailReverify(
    userId: string,
    newEmail: string,
    verificationTokenHash: string,
    verificationExpiresAt: Date,
    isEmailVerified: boolean
  ): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;

    return UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          email: newEmail,
          emailVerificationTokenHash: verificationTokenHash,
          emailVerificationExpiresAt: verificationExpiresAt,
          isEmailVerified
        }
      },
      { new: true }
    ).exec();
  }

  async revertEmailSnapshot(
    userId: string,
    snapshot: { email: string; isEmailVerified: boolean }
  ): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;

    return UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          email: snapshot.email,
          isEmailVerified: snapshot.isEmailVerified,
          emailVerificationTokenHash: null,
          emailVerificationExpiresAt: null
        }
      },
      { new: true }
    ).exec();
  }

  async updatePasswordReset(userId: string, input: {
    tokenHash: string | null;
    expiresAt: Date | null;
  }): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;

    return UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          passwordResetTokenHash: input.tokenHash,
          passwordResetExpiresAt: input.expiresAt
        }
      },
      { new: true }
    ).exec();
  }

  async updatePasswordAndClearTokens(userId: string, passwordHash: string): Promise<UserEntity | null> {
    if (!Types.ObjectId.isValid(userId)) return null;

    return UserModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          passwordHash,
          passwordResetTokenHash: null,
          passwordResetExpiresAt: null,
          refreshTokens: []
        }
      },
      { new: true }
    ).exec();
  }
}

export const userRepository = new UserRepository();
