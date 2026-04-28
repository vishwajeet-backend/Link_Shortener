import { z } from "zod";
import { URL_STATUS, USER_STATUS } from "../../types/common";

export const adminUrlActionParamsSchema = {
  params: z.object({
    id: z.string().trim().min(1)
  })
};

export const adminListUsersQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(Object.values(USER_STATUS) as [string, ...string[]]).optional(),
    search: z.string().trim().max(200).optional()
  })
};

export const adminUserActionParamsSchema = {
  params: z.object({
    id: z.string().trim().min(1)
  })
};

export const adminListUrlsQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(Object.values(URL_STATUS) as [string, ...string[]]).optional(),
    search: z.string().trim().max(200).optional(),
    ownerId: z.string().trim().optional()
  })
};
