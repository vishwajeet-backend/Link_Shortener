import nodemailer from "nodemailer";
import { env } from "../config/env";
import { adminSettingRepository } from "../repositories/admin-setting.repository";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  fromEmail: string;
  fromName: string;
};

let cachedTransporter: nodemailer.Transporter | null = null;
let cachedKey: string | null = null;

const resolveSmtpConfig = async (): Promise<SmtpConfig> => {
  const settings = await adminSettingRepository.getSettings();
  const smtp = settings.smtp ?? {};

  return {
    host: smtp.host ?? env.SMTP_HOST,
    port: smtp.port ?? env.SMTP_PORT,
    secure: smtp.secure ?? env.SMTP_SECURE,
    user: smtp.user ?? env.SMTP_USER,
    pass: smtp.pass ?? env.SMTP_PASS,
    fromEmail: smtp.fromEmail ?? env.SMTP_FROM_EMAIL,
    fromName: smtp.fromName ?? env.SMTP_FROM_NAME
  };
};

const getTransporter = async (): Promise<{ transporter: nodemailer.Transporter; config: SmtpConfig }> => {
  const config = await resolveSmtpConfig();
  const key = JSON.stringify(config);

  if (!cachedTransporter || cachedKey !== key) {
    const auth = config.user && config.pass ? { user: config.user, pass: config.pass } : undefined;

    cachedTransporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth
    });
    cachedKey = key;
  }

  return { transporter: cachedTransporter, config };
};

export const sendEmail = async (input: SendEmailInput): Promise<nodemailer.SentMessageInfo> => {
  const { transporter, config } = await getTransporter();

  return transporter.sendMail({
    from: `${config.fromName} <${config.fromEmail}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text
  });
};
