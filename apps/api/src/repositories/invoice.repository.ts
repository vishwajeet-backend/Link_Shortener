import { HydratedDocument, isValidObjectId } from "mongoose";
import { InvoiceModel, type InvoiceDocument } from "../models/invoice.model";
import { INVOICE_STATUS, type InvoiceStatus, type InvoiceType, type PaymentProvider } from "../types/common";

type InvoiceEntity = HydratedDocument<InvoiceDocument>;

export class InvoiceRepository {
  async createInvoice(input: {
    userId: string;
    type: InvoiceType;
    status: InvoiceStatus;
    amount: number;
    currency: string;
    provider?: PaymentProvider;
    referenceId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<InvoiceEntity> {
    return InvoiceModel.create({
      userId: input.userId,
      type: input.type,
      status: input.status,
      amount: input.amount,
      currency: input.currency,
      provider: input.provider,
      referenceId: input.referenceId,
      metadata: input.metadata
    });
  }

  async updateProviderOrder(invoiceId: string, input: { providerOrderId: string }): Promise<InvoiceEntity | null> {
    if (!isValidObjectId(invoiceId)) return null;
    return InvoiceModel.findByIdAndUpdate(
      invoiceId,
      { $set: { providerOrderId: input.providerOrderId } },
      { new: true }
    ).exec();
  }

  async findByProviderOrderId(providerOrderId: string): Promise<InvoiceEntity | null> {
    return InvoiceModel.findOne({ providerOrderId }).exec();
  }

  async findById(invoiceId: string): Promise<InvoiceEntity | null> {
    if (!isValidObjectId(invoiceId)) return null;
    return InvoiceModel.findById(invoiceId).exec();
  }

  async markPaid(invoiceId: string, input: { providerPaymentId?: string; providerSignature?: string }): Promise<InvoiceEntity | null> {
    if (!isValidObjectId(invoiceId)) return null;
    return InvoiceModel.findByIdAndUpdate(
      invoiceId,
      {
        $set: {
          status: INVOICE_STATUS.PAID,
          providerPaymentId: input.providerPaymentId,
          providerSignature: input.providerSignature,
          paidAt: new Date()
        }
      },
      { new: true }
    ).exec();
  }

  async listByUser(userId: string, input: { page: number; limit: number; type?: InvoiceType }) {
    if (!isValidObjectId(userId)) return { data: [], total: 0 };
    const filter: Record<string, unknown> = { userId };
    if (input.type) filter.type = input.type;

    const skip = (input.page - 1) * input.limit;
    const [data, total] = await Promise.all([
      InvoiceModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(input.limit).exec(),
      InvoiceModel.countDocuments(filter)
    ]);

    return { data, total };
  }

  async listAll(input: { page: number; limit: number; type?: InvoiceType; status?: InvoiceStatus }) {
    const filter: Record<string, unknown> = {};
    if (input.type) filter.type = input.type;
    if (input.status) filter.status = input.status;

    const skip = (input.page - 1) * input.limit;
    const [data, total] = await Promise.all([
      InvoiceModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(input.limit).exec(),
      InvoiceModel.countDocuments(filter)
    ]);

    return { data, total };
  }
}

export const invoiceRepository = new InvoiceRepository();
