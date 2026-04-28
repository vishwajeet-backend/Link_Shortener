import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { adminService } from "./admin.service";
import type { AdminListUrlsQuery, AdminListUsersQuery } from "./admin.types";

export class AdminController {
  async listUsers(req: Request, res: Response): Promise<void> {
    const data = await adminService.listUsers(req.query as unknown as AdminListUsersQuery);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async banUser(req: Request, res: Response): Promise<void> {
    const data = await adminService.banUser(String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const data = await adminService.deleteUser(String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async listUrls(req: Request, res: Response): Promise<void> {
    const data = await adminService.listUrls(req.query as unknown as AdminListUrlsQuery);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async pauseUrl(req: Request, res: Response): Promise<void> {
    const data = await adminService.pauseUrl(String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async activateUrl(req: Request, res: Response): Promise<void> {
    const data = await adminService.activateUrl(String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async deleteUrl(req: Request, res: Response): Promise<void> {
    const data = await adminService.deleteUrl(String(req.params.id));
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const adminController = new AdminController();
