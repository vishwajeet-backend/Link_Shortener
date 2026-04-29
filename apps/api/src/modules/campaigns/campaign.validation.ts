import { z } from "zod";
import { CAMPAIGN_STATUS, CAMPAIGN_TYPE, TARGET_DEVICE } from "../../types/common";

export const createCampaignSchema = {
  body: z.object({
    name: z.string().trim().min(2).max(120),
    type: z.enum(Object.values(CAMPAIGN_TYPE) as [string, ...string[]]),
    targetDevice: z.enum(Object.values(TARGET_DEVICE) as [string, ...string[]]).default(TARGET_DEVICE.ALL),
    targetCountries: z.array(z.string().trim().max(2)).max(200).optional(),
    targetExcludeCountries: z.array(z.string().trim().max(2)).max(200).optional(),
    targetBrowsers: z.array(z.string().trim().max(50)).max(50).optional(),
    targetOs: z.array(z.string().trim().max(50)).max(50).optional(),
    targetLanguages: z.array(z.string().trim().max(10)).max(50).optional(),
    budgetTotal: z.coerce.number().min(0),
    landingUrl: z.string().trim().url().max(2048).optional(),
    creativeTitle: z.string().trim().max(140).optional(),
    creativeBody: z.string().trim().max(500).optional(),
    creativeCta: z.string().trim().max(80).optional(),
    creativeImageUrl: z.string().trim().url().max(2048).optional(),
    creativeVideoUrl: z.string().trim().url().max(2048).optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional()
  })
};

export const updateCampaignSchema = {
  body: z
    .object({
      name: z.string().trim().min(2).max(120).optional(),
      targetDevice: z.enum(Object.values(TARGET_DEVICE) as [string, ...string[]]).optional(),
      targetCountries: z.array(z.string().trim().max(2)).max(200).optional(),
      targetExcludeCountries: z.array(z.string().trim().max(2)).max(200).optional(),
      targetBrowsers: z.array(z.string().trim().max(50)).max(50).optional(),
      targetOs: z.array(z.string().trim().max(50)).max(50).optional(),
      targetLanguages: z.array(z.string().trim().max(10)).max(50).optional(),
      budgetTotal: z.coerce.number().min(0).optional(),
      landingUrl: z.string().trim().url().max(2048).optional(),
      creativeTitle: z.string().trim().max(140).optional(),
      creativeBody: z.string().trim().max(500).optional(),
      creativeCta: z.string().trim().max(80).optional(),
      creativeImageUrl: z.string().trim().url().max(2048).optional(),
      creativeVideoUrl: z.string().trim().url().max(2048).optional(),
      startsAt: z.string().datetime().nullable().optional(),
      endsAt: z.string().datetime().nullable().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided"
    })
};

export const listCampaignsSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(Object.values(CAMPAIGN_STATUS) as [string, ...string[]]).optional()
  })
};

export const campaignIdParamsSchema = {
  params: z.object({
    id: z.string().trim().min(1)
  })
};
