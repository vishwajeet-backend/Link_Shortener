import type { PlanInterval, SubscriptionStatus } from "../../types/common";

export type SubscriptionSummary = {
  id: string;
  planId: string;
  planName: string;
  interval: PlanInterval;
  status: SubscriptionStatus;
  startsAt: Date;
  endsAt?: Date;
  renewAt?: Date;
};
