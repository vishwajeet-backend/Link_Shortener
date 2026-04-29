import type { HydratedDocument } from "mongoose";
import { StatusCodes } from "http-status-codes";
import type { InvoiceDocument } from "../../models/invoice.model";
import { invoiceRepository } from "../../repositories/invoice.repository";
import type { InvoiceListItem, ListInvoicesQuery } from "./invoice.types";

type ServiceError = Error & { statusCode?: number };

const buildServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

export class InvoiceService {
  async listUserInvoices(userId: string, query: ListInvoicesQuery): Promise<{
    items: InvoiceListItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { data, total } = await invoiceRepository.listByUser(userId, query);
    return {
      items: data.map((invoice) => this.toItem(invoice)),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit))
      }
    };
  }

  async listAllInvoices(query: ListInvoicesQuery): Promise<{
    items: InvoiceListItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { data, total } = await invoiceRepository.listAll(query);
    return {
      items: data.map((invoice) => this.toItem(invoice)),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit))
      }
    };
  }

  async getInvoiceById(invoiceId: string) {
    const invoice = await invoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw buildServiceError("Invoice not found", StatusCodes.NOT_FOUND);
    }
    return this.toItem(invoice);
  }

  private toItem(invoice: HydratedDocument<InvoiceDocument>): InvoiceListItem {
    return {
      id: String(invoice._id),
      type: invoice.type as InvoiceListItem["type"],
      status: invoice.status as InvoiceListItem["status"],
      amount: invoice.amount,
      currency: invoice.currency,
      provider: invoice.provider as InvoiceListItem["provider"],
      providerOrderId: invoice.providerOrderId,
      providerPaymentId: invoice.providerPaymentId,
      referenceId: invoice.referenceId,
      createdAt: invoice.createdAt,
      paidAt: invoice.paidAt
    };
  }
}

export const invoiceService = new InvoiceService();
