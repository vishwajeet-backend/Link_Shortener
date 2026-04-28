import { EMAIL_EVENT_TYPE, type EmailEventType, type UrlStatus } from "../../types/common";

type UrlStatusEmailTemplateInput = {
  eventType: EmailEventType;
  recipientName: string;
  shortCode: string;
  originalUrl: string;
  status: UrlStatus;
};

const eventToActionText: Record<EmailEventType, string> = {
  [EMAIL_EVENT_TYPE.URL_PAUSED]: "paused",
  [EMAIL_EVENT_TYPE.URL_ACTIVATED]: "activated",
  [EMAIL_EVENT_TYPE.URL_DELETED]: "deleted"
};

export const buildUrlStatusEmailTemplate = (input: UrlStatusEmailTemplateInput) => {
  const actionText = eventToActionText[input.eventType];
  const subject = `Your short URL has been ${actionText}`;
  const text = [
    `Hi ${input.recipientName},`,
    "",
    `Your short URL "${input.shortCode}" has been ${actionText} by an administrator.`,
    `Current status: ${input.status}`,
    `Original URL: ${input.originalUrl}`,
    "",
    "If you believe this action is incorrect, please contact support.",
    "",
    "Regards,",
    "Link Shortener Team"
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #111827;">
      <p>Hi ${input.recipientName},</p>
      <p>Your short URL <strong>${input.shortCode}</strong> has been <strong>${actionText}</strong> by an administrator.</p>
      <p><strong>Current status:</strong> ${input.status}</p>
      <p><strong>Original URL:</strong> ${input.originalUrl}</p>
      <p>If you believe this action is incorrect, please contact support.</p>
      <p>Regards,<br/>Link Shortener Team</p>
    </div>
  `;

  return { subject, text, html };
};
