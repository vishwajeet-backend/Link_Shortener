import { model, models, Schema, Types } from "mongoose";
import { PAYMENT_PROVIDER, type PaymentProvider } from "../types/common";

export interface PaymentTransactionDocument {
  invoiceId?: Types.ObjectId;
  provider: PaymentProvider;
  eventType: string;
  payload: Record<string, unknown>;
  signature?: string;
  receivedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentTransactionSchema = new Schema<PaymentTransactionDocument>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" },
    provider: { type: String, enum: Object.values(PAYMENT_PROVIDER), required: true },
    eventType: { type: String, required: true, trim: true, maxlength: 120 },
    payload: { type: Schema.Types.Mixed, required: true },
    signature: { type: String, trim: true, maxlength: 256 },
    receivedAt: { type: Date, required: true, default: Date.now }
  },
  { timestamps: true, versionKey: false }
);

paymentTransactionSchema.index({ provider: 1, eventType: 1, receivedAt: -1 }, { name: "idx_payment_tx_event" });

export const PaymentTransactionModel =
  models.PaymentTransaction || model<PaymentTransactionDocument>("PaymentTransaction", paymentTransactionSchema);
