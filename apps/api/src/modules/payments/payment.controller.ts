import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { paymentService } from "./payment.service";
import type { CreateOrderInput, RazorpayVerifyInput } from "./payment.types";

export class PaymentController {
  async createRazorpayOrder(req: Request, res: Response): Promise<void> {
    const payload = req.body as CreateOrderInput;
    const data = await paymentService.createRazorpayOrder(req.authUser!.userId, payload);
    res.status(StatusCodes.CREATED).json({ success: true, data });
  }

  async verifyRazorpayPayment(req: Request, res: Response): Promise<void> {
    const payload = req.body as RazorpayVerifyInput;
    await paymentService.verifyRazorpayPayment(req.authUser!.userId, payload);
    res.status(StatusCodes.OK).json({ success: true, data: { verified: true } });
  }
}

export const paymentController = new PaymentController();
