import { z } from "zod";
import { INVOICE_STATUS, INVOICE_TYPE } from "../../types/common";

export const listInvoicesSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    type: z.enum(Object.values(INVOICE_TYPE) as [string, ...string[]]).optional(),
    status: z.enum(Object.values(INVOICE_STATUS) as [string, ...string[]]).optional()
  })
};

export const invoiceIdParamsSchema = {
  params: z.object({
    id: z.string().trim().min(1)
  })
};
