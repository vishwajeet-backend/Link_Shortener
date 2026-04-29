import { model, models, Schema, Types } from "mongoose";
import { SUBSCRIPTION_STATUS, type SubscriptionStatus } from "../types/common";

export interface SubscriptionDocument {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  status: SubscriptionStatus;
  startsAt: Date;
  endsAt?: Date;
  renewAt?: Date;
  canceledAt?: Date;
  provider?: string;
  providerSubscriptionId?: string;
  latestInvoiceId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<SubscriptionDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    status: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: SUBSCRIPTION_STATUS.PENDING,
      required: true,
      index: true
    },
    startsAt: { type: Date, required: true, default: Date.now },
    endsAt: { type: Date },
    renewAt: { type: Date },
    canceledAt: { type: Date },
    provider: { type: String, trim: true, maxlength: 64 },
    providerSubscriptionId: { type: String, trim: true, maxlength: 128 },
    latestInvoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" }
  },
  { timestamps: true, versionKey: false }
);

subscriptionSchema.index({ userId: 1, status: 1 }, { name: "idx_subscription_user_status" });
subscriptionSchema.index({ planId: 1, status: 1 }, { name: "idx_subscription_plan_status" });

export const SubscriptionModel =
  models.Subscription || model<SubscriptionDocument>("Subscription", subscriptionSchema);
