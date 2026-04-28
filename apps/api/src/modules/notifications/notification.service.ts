import nodemailer from "nodemailer";
import { Types } from "mongoose";
import { env } from "../../config/env";
import { emailLogRepository } from "../../repositories/email-log.repository";
import {
  EMAIL_DELIVERY_STATUS,
  type EmailEventType,
  type UrlStatus
} from "../../types/common";
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

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS
  }
});

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
      const result = await transporter.sendMail({
        from: `"${env.SMTP_FROM_NAME}" <${env.SMTP_FROM_EMAIL}>`,
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
