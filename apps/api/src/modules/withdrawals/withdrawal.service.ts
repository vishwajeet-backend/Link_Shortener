import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { withdrawalRepository } from "../../repositories/withdrawal.repository";
import { walletService } from "../wallet/wallet.service";
import { WITHDRAWAL_STATUS } from "../../types/common";
import type { CreateWithdrawalInput, ListWithdrawalsQuery, WithdrawalListItem } from "./withdrawal.types";

type ServiceError = Error & { statusCode?: number };

const buildServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

export class WithdrawalService {
  async requestWithdrawal(userId: string, input: CreateWithdrawalInput): Promise<WithdrawalListItem> {
    await walletService.moveToPending(userId, input.amount);

    const created = await withdrawalRepository.createWithdrawal({
      userId: new Types.ObjectId(userId),
      amount: input.amount,
      status: WITHDRAWAL_STATUS.PENDING,
      payoutMethod: input.payoutMethod,
      payoutAccount: input.payoutAccount,
      memo: input.memo
    });

    return this.toItem(created);
  }

  async listMyWithdrawals(userId: string, query: ListWithdrawalsQuery): Promise<{
    items: WithdrawalListItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { data, total } = await withdrawalRepository.listByUser(userId, query);
    return {
      items: data.map((row) => this.toItem(row)),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit))
      }
    };
  }

  async listAllWithdrawals(query: ListWithdrawalsQuery): Promise<{
    items: WithdrawalListItem[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { data, total } = await withdrawalRepository.listAll(query);
    return {
      items: data.map((row) => this.toItem(row)),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / query.limit))
      }
    };
  }

  async updateStatus(withdrawalId: string, status: string, memo?: string): Promise<WithdrawalListItem> {
    const existing = await withdrawalRepository.findById(withdrawalId);
    if (!existing) {
      throw buildServiceError("Withdrawal not found", StatusCodes.NOT_FOUND);
    }

    if (status === WITHDRAWAL_STATUS.REJECTED) {
      await walletService.refundPending(String(existing.userId), existing.amount, withdrawalId);
      const updated = await withdrawalRepository.updateStatus(withdrawalId, WITHDRAWAL_STATUS.REJECTED, {
        rejectedAt: new Date(),
        memo
      });
      if (!updated) throw buildServiceError("Unable to update withdrawal", StatusCodes.INTERNAL_SERVER_ERROR);
      return this.toItem(updated);
    }

    if (status === WITHDRAWAL_STATUS.APPROVED) {
      const updated = await withdrawalRepository.updateStatus(withdrawalId, WITHDRAWAL_STATUS.APPROVED, {
        approvedAt: new Date(),
        memo
      });
      if (!updated) throw buildServiceError("Unable to update withdrawal", StatusCodes.INTERNAL_SERVER_ERROR);
      return this.toItem(updated);
    }

    if (status === WITHDRAWAL_STATUS.PAID) {
      await walletService.releasePending(String(existing.userId), existing.amount, withdrawalId);
      const updated = await withdrawalRepository.updateStatus(withdrawalId, WITHDRAWAL_STATUS.PAID, {
        processedAt: new Date(),
        memo
      });
      if (!updated) throw buildServiceError("Unable to update withdrawal", StatusCodes.INTERNAL_SERVER_ERROR);
      return this.toItem(updated);
    }

    throw buildServiceError("Unsupported withdrawal status", StatusCodes.BAD_REQUEST);
  }

  private toItem(row: Awaited<ReturnType<typeof withdrawalRepository.findById>>): WithdrawalListItem {
    if (!row) {
      throw buildServiceError("Withdrawal not found", StatusCodes.NOT_FOUND);
    }

    return {
      id: row.id,
      amount: row.amount,
      status: row.status,
      payoutMethod: row.payoutMethod,
      payoutAccount: row.payoutAccount,
      memo: row.memo,
      createdAt: row.createdAt,
      approvedAt: row.approvedAt,
      rejectedAt: row.rejectedAt,
      processedAt: row.processedAt
    };
  }
}

export const withdrawalService = new WithdrawalService();
