import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { subscriptionService } from "./subscription.service";

export class SubscriptionController {
  async getCurrent(req: Request, res: Response): Promise<void> {
    const data = await subscriptionService.getCurrentSubscription(req.authUser!.userId);
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const subscriptionController = new SubscriptionController();
