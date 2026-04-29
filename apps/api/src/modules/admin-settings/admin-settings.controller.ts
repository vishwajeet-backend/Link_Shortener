import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminSettingsService } from "./admin-settings.service";
import type { UpdateAdminSettingsInput } from "./admin-settings.types";

export class AdminSettingsController {
  async getSettings(_req: Request, res: Response): Promise<void> {
    const data = await adminSettingsService.getSettings();
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async updateSettings(req: Request, res: Response): Promise<void> {
    const payload = req.body as UpdateAdminSettingsInput;
    const data = await adminSettingsService.updateSettings(payload);
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const adminSettingsController = new AdminSettingsController();
