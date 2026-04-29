import dotenv from "dotenv";
import mongoose from "mongoose";
import { env } from "../config/env";
import { UserModel } from "../models/user.model";
import { ROLES, USER_STATUS } from "../types/common";
import { hashPassword } from "../utils/hash";

dotenv.config();

const bootstrapAdmin = async (): Promise<void> => {
  const email = process.env.SEED_ADMIN_EMAIL;
  const name = process.env.SEED_ADMIN_NAME ?? "Platform Admin";
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required");
  }

  await mongoose.connect(env.MONGODB_URI);

  const passwordHash = await hashPassword(password);
  await UserModel.updateOne(
    { email: email.toLowerCase() },
    {
      $set: {
        name,
        passwordHash,
        role: ROLES.ADMIN,
        status: USER_STATUS.ACTIVE,
        isEmailVerified: true,
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null
      }
    },
    { upsert: true }
  ).exec();

  console.info(`Admin bootstrap complete for: ${email}`);
  await mongoose.disconnect();
};

bootstrapAdmin().catch(async (error) => {
  console.error("Admin bootstrap failed", error);
  await mongoose.disconnect();
  process.exit(1);
});
