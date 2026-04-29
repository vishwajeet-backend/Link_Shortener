import { StatusCodes } from "http-status-codes";
import { walletRepository } from "../../repositories/wallet.repository";
import { walletLedgerRepository } from "../../repositories/wallet-ledger.repository";
import { WALLET_TX_SOURCE, WALLET_TX_TYPE, type WalletTxSource } from "../../types/common";
import type { WalletLedgerItem, WalletLedgerQuery, WalletSummary } from "./wallet.types";

type ServiceError = Error & { statusCode?: number };

const buildServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

export class WalletService {
  async getSummary(userId: string): Promise<WalletSummary> {
    const wallet = await walletRepository.getOrCreateWallet(userId);
    return { balance: wallet.balance, pendingAmount: wallet.pendingAmount };
  }

  async listLedger(userId: string, query: WalletLedgerQuery): Promise<{
    items: WalletLedgerItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { data, total } = await walletLedgerRepository.listByUser(userId, query);
    return {
      items: data.map((entry) => ({
        id: entry.id,
        type: entry.type,
        source: entry.source,
        amount: entry.amount,
        balanceAfter: entry.balanceAfter,
        referenceId: entry.referenceId,
        memo: entry.memo,
        createdAt: entry.createdAt
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit))
      }
    };
  }

  async credit(
    userId: string,
    amount: number,
    source: WalletTxSource = WALLET_TX_SOURCE.ADJUSTMENT,
    referenceId?: string,
    memo?: string
  ): Promise<void> {
    if (amount <= 0) {
      throw buildServiceError("Amount must be greater than zero", StatusCodes.BAD_REQUEST);
    }

    const wallet = await walletRepository.getOrCreateWallet(userId);
    const nextBalance = wallet.balance + amount;

    await walletRepository.updateBalances(userId, {
      balance: nextBalance,
      pendingAmount: wallet.pendingAmount
    });

    await walletLedgerRepository.createEntry({
      userId: wallet.userId,
      type: WALLET_TX_TYPE.CREDIT,
      source,
      amount,
      balanceAfter: nextBalance,
      referenceId,
      memo
    });
  }

  async debit(
    userId: string,
    amount: number,
    source: WalletTxSource = WALLET_TX_SOURCE.ADJUSTMENT,
    referenceId?: string,
    memo?: string
  ): Promise<void> {
    if (amount <= 0) {
      throw buildServiceError("Amount must be greater than zero", StatusCodes.BAD_REQUEST);
    }

    const wallet = await walletRepository.getOrCreateWallet(userId);
    if (wallet.balance < amount) {
      throw buildServiceError("Insufficient wallet balance", StatusCodes.BAD_REQUEST);
    }

    const nextBalance = wallet.balance - amount;

    await walletRepository.updateBalances(userId, {
      balance: nextBalance,
      pendingAmount: wallet.pendingAmount
    });

    await walletLedgerRepository.createEntry({
      userId: wallet.userId,
      type: WALLET_TX_TYPE.DEBIT,
      source,
      amount,
      balanceAfter: nextBalance,
      referenceId,
      memo
    });
  }

  async moveToPending(userId: string, amount: number, referenceId?: string): Promise<void> {
    if (amount <= 0) {
      throw buildServiceError("Amount must be greater than zero", StatusCodes.BAD_REQUEST);
    }

    const wallet = await walletRepository.getOrCreateWallet(userId);
    if (wallet.balance < amount) {
      throw buildServiceError("Insufficient wallet balance", StatusCodes.BAD_REQUEST);
    }

    const nextBalance = wallet.balance - amount;
    const nextPending = wallet.pendingAmount + amount;

    await walletRepository.updateBalances(userId, {
      balance: nextBalance,
      pendingAmount: nextPending
    });

    await walletLedgerRepository.createEntry({
      userId: wallet.userId,
      type: WALLET_TX_TYPE.DEBIT,
      source: WALLET_TX_SOURCE.WITHDRAWAL,
      amount,
      balanceAfter: nextBalance,
      referenceId,
      memo: "Withdrawal requested"
    });
  }

  async releasePending(userId: string, amount: number, referenceId?: string): Promise<void> {
    const wallet = await walletRepository.getOrCreateWallet(userId);
    const nextPending = Math.max(0, wallet.pendingAmount - amount);

    await walletRepository.updateBalances(userId, {
      balance: wallet.balance,
      pendingAmount: nextPending
    });

    await walletLedgerRepository.createEntry({
      userId: wallet.userId,
      type: WALLET_TX_TYPE.DEBIT,
      source: WALLET_TX_SOURCE.WITHDRAWAL,
      amount: 0,
      balanceAfter: wallet.balance,
      referenceId,
      memo: "Withdrawal processed"
    });
  }

  async refundPending(userId: string, amount: number, referenceId?: string): Promise<void> {
    const wallet = await walletRepository.getOrCreateWallet(userId);
    const nextBalance = wallet.balance + amount;
    const nextPending = Math.max(0, wallet.pendingAmount - amount);

    await walletRepository.updateBalances(userId, {
      balance: nextBalance,
      pendingAmount: nextPending
    });

    await walletLedgerRepository.createEntry({
      userId: wallet.userId,
      type: WALLET_TX_TYPE.CREDIT,
      source: WALLET_TX_SOURCE.ADJUSTMENT,
      amount,
      balanceAfter: nextBalance,
      referenceId,
      memo: "Withdrawal rejected"
    });
  }
}

export const walletService = new WalletService();
