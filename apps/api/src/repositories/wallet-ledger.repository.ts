import { HydratedDocument, isValidObjectId } from "mongoose";
import { WalletLedgerModel, type WalletLedgerDocument } from "../models/wallet-ledger.model";

type WalletLedgerEntity = HydratedDocument<WalletLedgerDocument>;

export class WalletLedgerRepository {
  async createEntry(input: Partial<WalletLedgerDocument>): Promise<WalletLedgerEntity> {
    return WalletLedgerModel.create(input);
  }

  async listByUser(userId: string, input: { page: number; limit: number }): Promise<{ data: WalletLedgerEntity[]; total: number }> {
    if (!isValidObjectId(userId)) return { data: [], total: 0 };
    const skip = (input.page - 1) * input.limit;
    const [data, total] = await Promise.all([
      WalletLedgerModel.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(input.limit).exec(),
      WalletLedgerModel.countDocuments({ userId })
    ]);

    return { data, total };
  }
}

export const walletLedgerRepository = new WalletLedgerRepository();
