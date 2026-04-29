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

  async userTopLinks(req: Request, res: Response): Promise<void> {
    const days = Number(req.query.days ?? 30);
    const limit = Number(req.query.limit ?? 10);
    const data = await analyticsService.getUserTopLinks(req.authUser!.userId, days, limit);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async userLinkDetails(req: Request, res: Response): Promise<void> {
    const days = Number(req.query.days ?? 30);
    const data = await analyticsService.getUserLinkDetails(
      req.authUser!.userId,
      String(req.params.id),
      days
    );
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async adminTopLinks(req: Request, res: Response): Promise<void> {
    const days = Number(req.query.days ?? 30);
    const limit = Number(req.query.limit ?? 10);
    const data = await analyticsService.getAdminTopLinks(days, limit);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async userExport(req: Request, res: Response): Promise<void> {
    const days = Number(req.query.days ?? 30);
    const type = String(req.query.type ?? "clicks");
    const csv = await analyticsService.getUserExport(req.authUser!.userId, days, type);
    res.setHeader("content-type", "text/csv");
    res.setHeader("content-disposition", "attachment; filename=analytics-user.csv");
    res.status(StatusCodes.OK).send(csv);
  }

  async adminExport(req: Request, res: Response): Promise<void> {
    const days = Number(req.query.days ?? 30);
    const type = String(req.query.type ?? "clicks");
    const csv = await analyticsService.getAdminExport(days, type);
    res.setHeader("content-type", "text/csv");
    res.setHeader("content-disposition", "attachment; filename=analytics-admin.csv");
    res.status(StatusCodes.OK).send(csv);
  }

  async userPresets(req: Request, res: Response): Promise<void> {
    const period = String(req.query.period ?? "monthly") as "monthly" | "yearly";
    const year = req.query.year ? Number(req.query.year) : undefined;
    const months = req.query.months ? Number(req.query.months) : undefined;
    const years = req.query.years ? Number(req.query.years) : undefined;
    const data = await analyticsService.getUserPresets(req.authUser!.userId, {
      period,
      year,
      months,
      years
    });
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async adminPresets(req: Request, res: Response): Promise<void> {
    const period = String(req.query.period ?? "monthly") as "monthly" | "yearly";
    const year = req.query.year ? Number(req.query.year) : undefined;
    const months = req.query.months ? Number(req.query.months) : undefined;
    const years = req.query.years ? Number(req.query.years) : undefined;
    const data = await analyticsService.getAdminPresets({ period, year, months, years });
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const analyticsController = new AnalyticsController();
