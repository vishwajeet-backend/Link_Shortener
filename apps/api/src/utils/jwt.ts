import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import type { Role } from "../types/common";

export type AccessTokenPayload = {
  userId: string;
  role: Role;
  type: "access";
};

export type RefreshTokenPayload = {
  userId: string;
  type: "refresh";
};

export const signAccessToken = (payload: Omit<AccessTokenPayload, "type">): string => {
  const expiresIn = env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"];
  const options: SignOptions = {
    expiresIn
  };

  return jwt.sign(
    { ...payload, type: "access" } satisfies AccessTokenPayload,
    env.JWT_ACCESS_SECRET,
    options
  );
};

export const signRefreshToken = (payload: Omit<RefreshTokenPayload, "type">): string => {
  const options: SignOptions = {
    expiresIn: `${env.JWT_REFRESH_EXPIRES_IN_DAYS}d`
  };

  return jwt.sign(
    { ...payload, type: "refresh" } satisfies RefreshTokenPayload,
    env.JWT_REFRESH_SECRET,
    options
  );
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
};
