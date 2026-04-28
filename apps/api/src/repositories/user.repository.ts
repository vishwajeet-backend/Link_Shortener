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
    search?: string;
  }): Promise<{ data: UserEntity[]; total: number }> {
    const filter: Record<string, unknown> = {};
    if (input.status) {
      filter.status = input.status;
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
}

export const userRepository = new UserRepository();
