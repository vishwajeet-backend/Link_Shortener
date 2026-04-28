import { HydratedDocument, isValidObjectId } from "mongoose";
import { EmailLogModel, type EmailLogDocument } from "../models/email-log.model";
import type { EmailDeliveryStatus } from "../types/common";

type EmailLogEntity = HydratedDocument<EmailLogDocument>;

export class EmailLogRepository {
  async createEmailLog(payload: Partial<EmailLogDocument>): Promise<EmailLogEntity> {
    return EmailLogModel.create(payload);
  }

  async updateDelivery(input: {
    id: string;
    status: EmailDeliveryStatus;
    providerMessageId?: string;
    error?: string;
    sentAt?: Date;
  }): Promise<void> {
    if (!isValidObjectId(input.id)) return;

    await EmailLogModel.updateOne(
      { _id: input.id },
      {
        $set: {
          status: input.status,
          providerMessageId: input.providerMessageId,
          error: input.error,
          sentAt: input.sentAt
        }
      }
    ).exec();
  }
}

export const emailLogRepository = new EmailLogRepository();
