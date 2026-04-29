import { z } from "zod";
import { INVOICE_TYPE } from "../../types/common";

export const createOrderSchema = {
  body: z.object({
    invoiceType: z.enum(Object.values(INVOICE_TYPE) as [string, ...string[]]),
    planId: z.string().trim().optional(),
    campaignId: z.string().trim().optional(),
    amount: z.coerce.number().min(1).optional(),
    currency: z.string().trim().max(8).default("INR")
  })
};

export const verifyRazorpaySchema = {
  body: z.object({
    razorpay_order_id: z.string().trim().min(1),
    razorpay_payment_id: z.string().trim().min(1),
    razorpay_signature: z.string().trim().min(1)
  })
};
