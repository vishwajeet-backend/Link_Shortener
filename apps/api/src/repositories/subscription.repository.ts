import { HydratedDocument, isValidObjectId } from "mongoose";
import { SubscriptionModel, type SubscriptionDocument } from "../models/subscription.model";
import type { SubscriptionStatus } from "../types/common";

type SubscriptionEntity = HydratedDocument<SubscriptionDocument>;

export class SubscriptionRepository {
  async findActiveByUser(userId: string): Promise<SubscriptionEntity | null> {
    if (!isValidObjectId(userId)) return null;
    return SubscriptionModel.findOne({
      userId,
      status: "ACTIVE",
      $or: [{ endsAt: { $exists: false } }, { endsAt: { $gt: new Date() } }]
    }).exec();
  }

  async cancelActiveByUser(userId: string): Promise<void> {
    if (!isValidObjectId(userId)) return;
    await SubscriptionModel.updateMany(
      { userId, status: "ACTIVE" },
      { $set: { status: "CANCELED", canceledAt: new Date() } }
    ).exec();
  }

  async createSubscription(input: {
    userId: string;
    planId: string;
    status: SubscriptionStatus;
    startsAt: Date;
    endsAt?: Date;
    renewAt?: Date;
    provider?: string;
    providerSubscriptionId?: string;
  }): Promise<SubscriptionEntity> {
    return SubscriptionModel.create(input);
  }

  async updateStatus(subscriptionId: string, status: SubscriptionStatus): Promise<SubscriptionEntity | null> {
    if (!isValidObjectId(subscriptionId)) return null;
    return SubscriptionModel.findByIdAndUpdate(
      subscriptionId,
      { $set: { status } },
      { new: true }
    ).exec();
  }
}

export const subscriptionRepository = new SubscriptionRepository();
