import { HydratedDocument, isValidObjectId } from "mongoose";
import { WalletModel, type WalletDocument } from "../models/wallet.model";

type WalletEntity = HydratedDocument<WalletDocument>;

export class WalletRepository {
  async getOrCreateWallet(userId: string): Promise<WalletEntity> {
    if (!isValidObjectId(userId)) {
      throw new Error("Invalid user id");
    }

    const existing = await WalletModel.findOne({ userId }).exec();
    if (existing) return existing;

    return WalletModel.create({ userId, balance: 0, pendingAmount: 0, lastUpdatedAt: new Date() });
  }

  async updateBalances(userId: string, input: { balance: number; pendingAmount: number }): Promise<WalletEntity | null> {
    if (!isValidObjectId(userId)) return null;
    return WalletModel.findOneAndUpdate(
      { userId },
      { $set: { balance: input.balance, pendingAmount: input.pendingAmount, lastUpdatedAt: new Date() } },
      { new: true }
    ).exec();
  }
}

export const walletRepository = new WalletRepository();
