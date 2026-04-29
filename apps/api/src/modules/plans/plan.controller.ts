import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { planService } from "./plan.service";
import type { CreatePlanInput, UpdatePlanInput } from "./plan.types";

export class PlanController {
  async listPlans(_req: Request, res: Response): Promise<void> {
    const data = await planService.listPlans();
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async listAllPlansAdmin(_req: Request, res: Response): Promise<void> {
    const data = await planService.listAllPlansAdmin();
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async createPlan(req: Request, res: Response): Promise<void> {
    const payload = req.body as CreatePlanInput;
    const data = await planService.createPlan(payload);
    res.status(StatusCodes.CREATED).json({ success: true, data });
  }

  async updatePlan(req: Request, res: Response): Promise<void> {
    const payload = req.body as UpdatePlanInput;
    const data = await planService.updatePlan(String(req.params.id), payload);
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const planController = new PlanController();
