import bcrypt from "bcryptjs";
import { createHash } from "crypto";

const PASSWORD_SALT_ROUNDS = 12;

export const hashPassword = async (value: string): Promise<string> => {
  return bcrypt.hash(value, PASSWORD_SALT_ROUNDS);
};

export const verifyPassword = async (
  plainValue: string,
  hashValue: string
): Promise<boolean> => {
  return bcrypt.compare(plainValue, hashValue);
};

export const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};
