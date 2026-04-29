import { model, models, Schema } from "mongoose";
import { PLAN_INTERVAL, type PlanInterval } from "../types/common";

export interface PlanDocument {
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: PlanInterval;
  isActive: boolean;
  isDefault: boolean;
  limits: {
    maxLinks: number;
    analyticsAccess: boolean;
    customAlias: boolean;
    campaignAccess: boolean;
    payoutLimit: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const planSchema = new Schema<PlanDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, maxlength: 8, default: "INR" },
    interval: {
      type: String,
      enum: Object.values(PLAN_INTERVAL),
      required: true,
      default: PLAN_INTERVAL.FREE
    },
    isActive: { type: Boolean, default: true },
    isDefault: { type: Boolean, default: false },
    limits: {
      maxLinks: { type: Number, required: true, min: 0 },
      analyticsAccess: { type: Boolean, default: true },
      customAlias: { type: Boolean, default: false },
      campaignAccess: { type: Boolean, default: false },
      payoutLimit: { type: Number, default: 0, min: 0 }
    }
  },
  { timestamps: true, versionKey: false }
);

planSchema.index({ isDefault: 1 }, { name: "idx_plan_default" });
planSchema.index({ isActive: 1, interval: 1 }, { name: "idx_plan_active_interval" });
planSchema.index({ name: 1 }, { name: "idx_plan_name" });

export const PlanModel = models.Plan || model<PlanDocument>("Plan", planSchema);
