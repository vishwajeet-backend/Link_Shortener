import type { PlanInterval } from "../../types/common";

export type PlanLimits = {
  maxLinks: number;
  analyticsAccess: boolean;
  customAlias: boolean;
  campaignAccess: boolean;
  payoutLimit: number;
};

export type PlanListItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: PlanInterval;
  isActive: boolean;
  isDefault: boolean;
  limits: PlanLimits;
};

export type CreatePlanInput = {
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: PlanInterval;
  isActive?: boolean;
  isDefault?: boolean;
  limits: PlanLimits;
};

export type UpdatePlanInput = Partial<CreatePlanInput>;
