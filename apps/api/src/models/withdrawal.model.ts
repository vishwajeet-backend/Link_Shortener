import { model, models, Schema, Types } from "mongoose";
import { WITHDRAWAL_STATUS, type WithdrawalStatus } from "../types/common";

export interface WithdrawalDocument {
  userId: Types.ObjectId;
  amount: number;
  status: WithdrawalStatus;
  payoutMethod?: string;
  payoutAccount?: string;
  memo?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalSchema = new Schema<WithdrawalDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: Object.values(WITHDRAWAL_STATUS),
      default: WITHDRAWAL_STATUS.PENDING,
      required: true,
      index: true
    },
    payoutMethod: { type: String, trim: true, maxlength: 64 },
    payoutAccount: { type: String, trim: true, maxlength: 256 },
    memo: { type: String, trim: true, maxlength: 500 },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    processedAt: { type: Date }
  },
  { timestamps: true, versionKey: false }
);

withdrawalSchema.index({ userId: 1, createdAt: -1 }, { name: "idx_withdrawal_user_time" });

export const WithdrawalModel =
  models.Withdrawal || model<WithdrawalDocument>("Withdrawal", withdrawalSchema);
