import { Types } from "mongoose";
import { emailLogRepository } from "../../repositories/email-log.repository";
import {
  EMAIL_DELIVERY_STATUS,
  type EmailEventType,
  type UrlStatus
} from "../../types/common";
import { sendEmail } from "../../utils/email";
import { buildUrlStatusEmailTemplate } from "./mail.templates";

type NotifyUrlStatusChangeInput = {
  userId: string;
  recipientEmail: string;
  recipientName: string;
  shortCode: string;
  originalUrl: string;
  eventType: EmailEventType;
  status: UrlStatus;
};

export class NotificationService {
  async notifyUrlStatusChange(input: NotifyUrlStatusChangeInput): Promise<void> {
    const template = buildUrlStatusEmailTemplate({
      eventType: input.eventType,
      recipientName: input.recipientName,
      shortCode: input.shortCode,
      originalUrl: input.originalUrl,
      status: input.status
    });

    const log = await emailLogRepository.createEmailLog({
      userId: new Types.ObjectId(input.userId),
      email: input.recipientEmail,
      eventType: input.eventType,
      status: EMAIL_DELIVERY_STATUS.PENDING,
      payload: {
        shortCode: input.shortCode,
        originalUrl: input.originalUrl,
        status: input.status
      }
    });

    try {
      const result = await sendEmail({
        to: input.recipientEmail,
        subject: template.subject,
        text: template.text,
        html: template.html
      });

      await emailLogRepository.updateDelivery({
        id: log.id,
        status: EMAIL_DELIVERY_STATUS.SENT,
        providerMessageId: result.messageId,
        sentAt: new Date()
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown email sending error";
      await emailLogRepository.updateDelivery({
        id: log.id,
        status: EMAIL_DELIVERY_STATUS.FAILED,
        error: message
      });
    }
  }
}

export const notificationService = new NotificationService();
