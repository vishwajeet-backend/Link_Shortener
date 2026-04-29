import { HydratedDocument, isValidObjectId } from "mongoose";
import { PaymentTransactionModel, type PaymentTransactionDocument } from "../models/payment-transaction.model";
import type { PaymentProvider } from "../types/common";

type PaymentTransactionEntity = HydratedDocument<PaymentTransactionDocument>;

export class PaymentTransactionRepository {
  async createTransaction(input: {
    invoiceId?: string;
    provider: PaymentProvider;
    eventType: string;
    payload: Record<string, unknown>;
    signature?: string;
    receivedAt?: Date;
  }): Promise<PaymentTransactionEntity> {
    return PaymentTransactionModel.create({
      invoiceId: input.invoiceId,
      provider: input.provider,
      eventType: input.eventType,
      payload: input.payload,
      signature: input.signature,
      receivedAt: input.receivedAt ?? new Date()
    });
  }

  async listByInvoice(invoiceId: string): Promise<PaymentTransactionEntity[]> {
    if (!isValidObjectId(invoiceId)) return [];
    return PaymentTransactionModel.find({ invoiceId }).sort({ createdAt: -1 }).exec();
  }
}

export const paymentTransactionRepository = new PaymentTransactionRepository();
