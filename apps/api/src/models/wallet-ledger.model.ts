import { model, models, Schema, Types } from "mongoose";
import { WALLET_TX_SOURCE, WALLET_TX_TYPE, type WalletTxSource, type WalletTxType } from "../types/common";

export interface WalletLedgerDocument {
  userId: Types.ObjectId;
  type: WalletTxType;
  source: WalletTxSource;
  amount: number;
  balanceAfter: number;
  referenceId?: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const walletLedgerSchema = new Schema<WalletLedgerDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: Object.values(WALLET_TX_TYPE), required: true },
    source: { type: String, enum: Object.values(WALLET_TX_SOURCE), required: true },
    amount: { type: Number, required: true, min: 0 },
    balanceAfter: { type: Number, required: true, min: 0 },
    referenceId: { type: String, trim: true, maxlength: 128 },
    memo: { type: String, trim: true, maxlength: 500 }
  },
  { timestamps: true, versionKey: false }
);

walletLedgerSchema.index({ userId: 1, createdAt: -1 }, { name: "idx_wallet_ledger_user_time" });

export const WalletLedgerModel =
  models.WalletLedger || model<WalletLedgerDocument>("WalletLedger", walletLedgerSchema);
