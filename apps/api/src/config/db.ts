import mongoose from "mongoose";
import { env } from "./env";

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.info("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    throw error;
  }
};
