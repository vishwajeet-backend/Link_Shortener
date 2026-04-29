import { z } from "zod";
import { PLAN_INTERVAL } from "../../types/common";

const limitsSchema = z.object({
  maxLinks: z.coerce.number().int().min(0),
  analyticsAccess: z.coerce.boolean().default(true),
  customAlias: z.coerce.boolean().default(false),
  campaignAccess: z.coerce.boolean().default(false),
  payoutLimit: z.coerce.number().min(0)
});

export const createPlanSchema = {
  body: z.object({
    name: z.string().trim().min(2).max(120),
    description: z.string().trim().max(500).optional(),
    price: z.coerce.number().min(0),
    currency: z.string().trim().max(8).default("INR"),
    interval: z.enum(Object.values(PLAN_INTERVAL) as [string, ...string[]]),
    isActive: z.coerce.boolean().optional(),
    isDefault: z.coerce.boolean().optional(),
    limits: limitsSchema
  })
};

export const updatePlanSchema = {
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      description: z.string().trim().max(500).optional(),
      price: z.coerce.number().min(0).optional(),
      currency: z.string().trim().max(8).optional(),
      interval: z.enum(Object.values(PLAN_INTERVAL) as [string, ...string[]]).optional(),
      isActive: z.coerce.boolean().optional(),
      isDefault: z.coerce.boolean().optional(),
      limits: limitsSchema.partial().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided"
    })
};

export const planIdParamsSchema = {
  params: z.object({
    id: z.string().trim().min(1)
  })
};
