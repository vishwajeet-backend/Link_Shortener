import { model, models, Schema, Types } from "mongoose";

export interface WalletDocument {
  userId: Types.ObjectId;
  balance: number;
  pendingAmount: number;
  lastUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const walletSchema = new Schema<WalletDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    balance: { type: Number, default: 0, min: 0 },
    pendingAmount: { type: Number, default: 0, min: 0 },
    lastUpdatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, versionKey: false }
);

export const WalletModel = models.Wallet || model<WalletDocument>("Wallet", walletSchema);
