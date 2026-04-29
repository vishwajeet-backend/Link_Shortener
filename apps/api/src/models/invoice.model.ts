import { model, models, Schema, Types } from "mongoose";
import { INVOICE_STATUS, INVOICE_TYPE, PAYMENT_PROVIDER, type InvoiceStatus, type InvoiceType, type PaymentProvider } from "../types/common";

export interface InvoiceDocument {
  userId: Types.ObjectId;
  type: InvoiceType;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  provider?: PaymentProvider;
  providerOrderId?: string;
  providerPaymentId?: string;
  providerSignature?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: Object.values(INVOICE_TYPE), required: true, index: true },
    status: { type: String, enum: Object.values(INVOICE_STATUS), required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, maxlength: 8 },
    provider: { type: String, enum: Object.values(PAYMENT_PROVIDER) },
    providerOrderId: { type: String, trim: true, maxlength: 128 },
    providerPaymentId: { type: String, trim: true, maxlength: 128 },
    providerSignature: { type: String, trim: true, maxlength: 256 },
    referenceId: { type: String, trim: true, maxlength: 128 },
    metadata: { type: Schema.Types.Mixed, default: {} },
    paidAt: { type: Date }
  },
  { timestamps: true, versionKey: false }
);

invoiceSchema.index({ userId: 1, createdAt: -1 }, { name: "idx_invoice_user_created_at" });
invoiceSchema.index({ providerOrderId: 1 }, { name: "idx_invoice_provider_order" });

export const InvoiceModel = models.Invoice || model<InvoiceDocument>("Invoice", invoiceSchema);
