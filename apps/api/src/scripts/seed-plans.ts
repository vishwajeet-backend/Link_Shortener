import dotenv from "dotenv";
import mongoose from "mongoose";
import { env } from "../config/env";
import { PlanModel } from "../models/plan.model";
import { PLAN_INTERVAL } from "../types/common";

dotenv.config();

type PlanSeed = {
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: (typeof PLAN_INTERVAL)[keyof typeof PLAN_INTERVAL];
  isActive: boolean;
  isDefault: boolean;
  limits: {
    maxLinks: number;
    analyticsAccess: boolean;
    customAlias: boolean;
    campaignAccess: boolean;
    payoutLimit: number;
  };
};

const definitions: PlanSeed[] = [
  {
    name: "Free",
    description: "Core shortening, analytics, and wallet basics for individuals.",
    price: 0,
    currency: "INR",
    interval: PLAN_INTERVAL.FREE,
    isActive: true,
    isDefault: true,
    limits: {
      maxLinks: 25,
      analyticsAccess: true,
      customAlias: false,
      campaignAccess: false,
      payoutLimit: 0
    }
  },
  {
    name: "Starter",
    description: "More links and custom aliases for creators and small teams.",
    price: 199,
    currency: "INR",
    interval: PLAN_INTERVAL.MONTHLY,
    isActive: true,
    isDefault: false,
    limits: {
      maxLinks: 200,
      analyticsAccess: true,
      customAlias: true,
      campaignAccess: false,
      payoutLimit: 5000
    }
  },
  {
    name: "Pro",
    description: "Campaign access, higher caps, and publisher-friendly payouts.",
    price: 499,
    currency: "INR",
    interval: PLAN_INTERVAL.MONTHLY,
    isActive: true,
    isDefault: false,
    limits: {
      maxLinks: 2000,
      analyticsAccess: true,
      customAlias: true,
      campaignAccess: true,
      payoutLimit: 25000
    }
  },
  {
    name: "Business (annual)",
    description: "Yearly billing with the highest limits for agencies and brands.",
    price: 4999,
    currency: "INR",
    interval: PLAN_INTERVAL.YEARLY,
    isActive: true,
    isDefault: false,
    limits: {
      maxLinks: 10000,
      analyticsAccess: true,
      customAlias: true,
      campaignAccess: true,
      payoutLimit: 100000
    }
  }
];

const seedPlans = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI);

  for (const def of definitions) {
    await PlanModel.findOneAndUpdate(
      { name: def.name },
      {
        $set: {
          description: def.description,
          price: def.price,
          currency: def.currency,
          interval: def.interval,
          isActive: def.isActive,
          limits: def.limits
        },
        $setOnInsert: { name: def.name, isDefault: def.isDefault }
      },
      { upsert: true }
    ).exec();
  }

  await PlanModel.updateMany({ name: { $ne: "Free" } }, { $set: { isDefault: false } }).exec();
  await PlanModel.updateOne({ name: "Free" }, { $set: { isDefault: true } }).exec();

  console.info(`Upserted ${definitions.length} plans (Free is the default tier).`);
  await mongoose.disconnect();
};

seedPlans().catch(async (error) => {
  console.error("Plan seed failed", error);
  await mongoose.disconnect();
  process.exit(1);
});
