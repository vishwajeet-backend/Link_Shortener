import { StatusCodes } from "http-status-codes";
import { adminSettingRepository } from "../../repositories/admin-setting.repository";
import type { AdminSettings, UpdateAdminSettingsInput } from "./admin-settings.types";

type ServiceError = Error & { statusCode?: number };

const buildServiceError = (message: string, statusCode: number): ServiceError => {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
};

export class AdminSettingsService {
  async getSettings(): Promise<AdminSettings> {
    const settings = await adminSettingRepository.getSettings();

    return {
      maintenanceMode: settings.maintenanceMode,
      maintenanceMessage: settings.maintenanceMessage,
      allowedDomains: settings.allowedDomains ?? [],
      smtp: settings.smtp ?? {},
      updatedAt: settings.updatedAt
    };
  }

  async updateSettings(input: UpdateAdminSettingsInput): Promise<AdminSettings> {
    if (!input || Object.keys(input).length === 0) {
      throw buildServiceError("No settings provided", StatusCodes.BAD_REQUEST);
    }

    const update: Record<string, unknown> = {};

    if (input.maintenanceMode !== undefined) {
      update.maintenanceMode = input.maintenanceMode;
    }

    if (input.maintenanceMessage !== undefined) {
      update.maintenanceMessage = input.maintenanceMessage;
    }

    if (input.allowedDomains !== undefined) {
      update.allowedDomains = input.allowedDomains;
    }

    if (input.smtp) {
      if (input.smtp.host !== undefined) update["smtp.host"] = input.smtp.host;
      if (input.smtp.port !== undefined) update["smtp.port"] = input.smtp.port;
      if (input.smtp.secure !== undefined) update["smtp.secure"] = input.smtp.secure;
      if (input.smtp.user !== undefined) update["smtp.user"] = input.smtp.user;
      if (input.smtp.pass !== undefined) update["smtp.pass"] = input.smtp.pass;
      if (input.smtp.fromEmail !== undefined) update["smtp.fromEmail"] = input.smtp.fromEmail;
      if (input.smtp.fromName !== undefined) update["smtp.fromName"] = input.smtp.fromName;
    }

    const updated = await adminSettingRepository.updateSettings(update);

    return {
      maintenanceMode: updated.maintenanceMode,
      maintenanceMessage: updated.maintenanceMessage,
      allowedDomains: updated.allowedDomains ?? [],
      smtp: updated.smtp ?? {},
      updatedAt: updated.updatedAt
    };
  }
}

export const adminSettingsService = new AdminSettingsService();
