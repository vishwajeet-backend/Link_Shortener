import type { WithdrawalStatus } from "../../types/common";

export type CreateWithdrawalInput = {
  amount: number;
  payoutMethod?: string;
  payoutAccount?: string;
  memo?: string;
};

export type WithdrawalListItem = {
  id: string;
  amount: number;
  status: WithdrawalStatus;
  payoutMethod?: string;
  payoutAccount?: string;
  memo?: string;
  createdAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  processedAt?: Date;
};

export type ListWithdrawalsQuery = {
  page: number;
  limit: number;
  status?: WithdrawalStatus;
};
