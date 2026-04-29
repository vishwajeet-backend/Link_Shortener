import type { Role, UserStatus } from "../../types/common";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  isEmailVerified: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UpdateProfileInput = {
  name?: string;
  avatarUrl?: string;
  email?: string;
  currentPassword?: string;
};

export type UpdatePasswordInput = {
  currentPassword: string;
  newPassword: string;
};
