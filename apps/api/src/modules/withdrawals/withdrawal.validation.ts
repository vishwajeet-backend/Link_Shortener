import { z } from "zod";
import { WITHDRAWAL_STATUS } from "../../types/common";

export const createWithdrawalSchema = {
  body: z.object({
    amount: z.coerce.number().min(1),
    payoutMethod: z.string().trim().max(64).optional(),
    payoutAccount: z.string().trim().max(256).optional(),
    memo: z.string().trim().max(500).optional()
  })
};

export const listWithdrawalsSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    status: z.enum(Object.values(WITHDRAWAL_STATUS) as [string, ...string[]]).optional()
  })
};

export const withdrawalIdParamsSchema = {
  params: z.object({
    id: z.string().trim().min(1)
  })
};

export const adminUpdateWithdrawalSchema = {
  params: z.object({
    id: z.string().trim().min(1)
  }),
  body: z.object({
    status: z.enum(Object.values(WITHDRAWAL_STATUS) as [string, ...string[]]),
    memo: z.string().trim().max(500).optional()
  })
};
