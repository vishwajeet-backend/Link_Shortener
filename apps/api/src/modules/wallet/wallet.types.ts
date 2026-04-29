import type { WalletTxSource, WalletTxType } from "../../types/common";

export type WalletSummary = {
  balance: number;
  pendingAmount: number;
};

export type WalletLedgerItem = {
  id: string;
  type: WalletTxType;
  source: WalletTxSource;
  amount: number;
  balanceAfter: number;
  referenceId?: string;
  memo?: string;
  createdAt: Date;
};

export type WalletLedgerQuery = {
  page: number;
  limit: number;
};
