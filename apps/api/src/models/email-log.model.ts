import { model, models, Schema, Types } from "mongoose";
import {
  EMAIL_DELIVERY_STATUS,
  EMAIL_EVENT_TYPE,
  type EmailDeliveryStatus,
  type EmailEventType
} from "../types/common";

export interface EmailLogDocument {
  userId: Types.ObjectId;
  email: string;
  eventType: EmailEventType;
  payload: Record<string, unknown>;
  status: EmailDeliveryStatus;
  providerMessageId?: string;
  error?: string;
  sentAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const emailLogSchema = new Schema<EmailLogDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 255 },
    eventType: {
      type: String,
      enum: Object.values(EMAIL_EVENT_TYPE),
      required: true,
      index: true
    },
    payload: { type: Schema.Types.Mixed, required: true, default: {} },
    status: {
      type: String,
      enum: Object.values(EMAIL_DELIVERY_STATUS),
      required: true,
      default: EMAIL_DELIVERY_STATUS.PENDING,
      index: true
    },
    providerMessageId: { type: String, trim: true, maxlength: 255 },
    error: { type: String, trim: true, maxlength: 2000 },
    sentAt: { type: Date }
  },
  { timestamps: true, versionKey: false }
);

emailLogSchema.index({ userId: 1, createdAt: -1 }, { name: "idx_email_log_user_created_at" });
emailLogSchema.index(
  { eventType: 1, status: 1, createdAt: -1 },
  { name: "idx_email_log_event_status_created_at" }
);

export const EmailLogModel =
  models.EmailLog || model<EmailLogDocument>("EmailLog", emailLogSchema);
