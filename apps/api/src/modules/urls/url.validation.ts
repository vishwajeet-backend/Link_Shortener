import { z } from "zod";
import { URL_STATUS } from "../../types/common";

export const createUrlSchema = {
  body: z.object({
    originalUrl: z.string().trim().min(1).max(2048),
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().min(1).max(1000).optional(),
    expiresAt: z.string().datetime().optional()
  })
};

export const listUrlsSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(Object.values(URL_STATUS) as [string, ...string[]]).optional(),
    search: z.string().trim().max(200).optional()
  })
};

export const getMyUrlByIdSchema = {
  params: z.object({
    id: z.string().trim().min(1)
  })
};
