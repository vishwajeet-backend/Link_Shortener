import type { Role } from "../../types/common";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthenticatedUser = {
  userId: string;
  name: string;
  email: string;
  role: Role;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RefreshInput = {
  refreshToken: string;
};

export type LogoutInput = {
  refreshToken: string;
};

export type GoogleLoginInput = {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
};
