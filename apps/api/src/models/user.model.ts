import { model, models, Schema } from "mongoose";
import { ROLES, USER_STATUS, type Role, type UserStatus } from "../types/common";

interface RefreshTokenSubdocument {
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;
  ip?: string;
  deviceInfo?: string;
}

export interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  authProvider?: "LOCAL" | "GOOGLE";
  googleId?: string;
  avatarUrl?: string;
  role: Role;
  status: UserStatus;
  isEmailVerified: boolean;
  emailVerificationTokenHash?: string;
  emailVerificationExpiresAt?: Date;
  passwordResetTokenHash?: string;
  passwordResetExpiresAt?: Date;
  lastLoginAt?: Date;
  refreshTokens: RefreshTokenSubdocument[];
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenSubdocument>(
  {
    tokenHash: { type: String, required: true, trim: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    revokedAt: { type: Date },
    ip: { type: String, trim: true },
    deviceInfo: { type: String, trim: true }
  },
  { _id: false }
);

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255
    },
    passwordHash: { type: String, required: true, minlength: 60, maxlength: 255 },
    authProvider: { type: String, enum: ["LOCAL", "GOOGLE"], default: "LOCAL" },
    googleId: { type: String, trim: true, index: true, sparse: true },
    avatarUrl: { type: String, trim: true, maxlength: 2048 },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.MEMBER,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
      required: true
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationTokenHash: { type: String, trim: true, index: true },
    emailVerificationExpiresAt: { type: Date },
    passwordResetTokenHash: { type: String, trim: true, index: true },
    passwordResetExpiresAt: { type: Date },
    lastLoginAt: { type: Date },
    refreshTokens: { type: [refreshTokenSchema], default: [] }
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ email: 1 }, { unique: true, name: "uniq_user_email" });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true, name: "uniq_user_google_id" });
userSchema.index({ role: 1, status: 1 }, { name: "idx_user_role_status" });

export const UserModel = models.User || model<UserDocument>("User", userSchema);
