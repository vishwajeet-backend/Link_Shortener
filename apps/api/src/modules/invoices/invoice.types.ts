import type { InvoiceStatus, InvoiceType, PaymentProvider } from "../../types/common";

export type InvoiceListItem = {
  id: string;
  type: InvoiceType;
  status: InvoiceStatus;
  amount: number;
  currency: string;
  provider?: PaymentProvider;
  providerOrderId?: string;
  providerPaymentId?: string;
  referenceId?: string;
  createdAt: Date;
  paidAt?: Date;
};

export type ListInvoicesQuery = {
  page: number;
  limit: number;
  type?: InvoiceType;
  status?: InvoiceStatus;
};
