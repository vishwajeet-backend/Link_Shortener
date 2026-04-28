import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { analyticsService } from "./analytics.service";

export class AnalyticsController {
  async userOverview(req: Request, res: Response): Promise<void> {
    const days = Number(req.query.days ?? 30);
    const data = await analyticsService.getUserOverview(req.authUser!.userId, days);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async adminOverview(req: Request, res: Response): Promise<void> {
    const days = Number(req.query.days ?? 30);
    const data = await analyticsService.getAdminOverview(days);
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const analyticsController = new AnalyticsController();
