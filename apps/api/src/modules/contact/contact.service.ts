import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env";
import { sendEmail } from "../../utils/email";

type ServiceError = Error & { statusCode?: number };

const buildServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export class ContactService {
  async submit(input: { name: string; email: string; message: string }): Promise<void> {
    if (!env.CONTACT_TO_EMAIL) {
      throw buildServiceError(
        "Contact form is not configured (set CONTACT_TO_EMAIL on the API)",
        StatusCodes.SERVICE_UNAVAILABLE
      );
    }

    await sendEmail({
      to: env.CONTACT_TO_EMAIL,
      subject: `[PurpleMerit Links] Contact from ${input.name}`,
      text: `From: ${input.name} <${input.email}>\n\n${input.message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(input.name)} &lt;${escapeHtml(input.email)}&gt;</p><p>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>`
    });
  }
}

export const contactService = new ContactService();
