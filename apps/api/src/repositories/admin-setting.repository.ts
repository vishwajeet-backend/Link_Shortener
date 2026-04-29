import type { HydratedDocument } from "mongoose";
import { env } from "../config/env";
import { AdminSettingModel, type AdminSettingDocument } from "../models/admin-setting.model";

export type AdminSettingEntity = HydratedDocument<AdminSettingDocument>;

const buildDefaults = (): Partial<AdminSettingDocument> => ({
  maintenanceMode: false,
  maintenanceMessage: "",
  allowedDomains: [],
  smtp: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    fromEmail: env.SMTP_FROM_EMAIL,
    fromName: env.SMTP_FROM_NAME
  }
});

export class AdminSettingRepository {
  async getSettings(): Promise<AdminSettingEntity> {
    const existing = await AdminSettingModel.findOne().exec();
    if (existing) return existing;

    return AdminSettingModel.create(buildDefaults());
  }

  async updateSettings(update: Record<string, unknown>): Promise<AdminSettingEntity> {
    return (await AdminSettingModel.findOneAndUpdate(
      {},
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).exec()) as AdminSettingEntity;
  }
}

export const adminSettingRepository = new AdminSettingRepository();
