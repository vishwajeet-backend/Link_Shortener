import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { contactService } from "./contact.service";

export class ContactController {
  async submit(req: Request, res: Response): Promise<void> {
    const body = req.body as { name: string; email: string; message: string };
    await contactService.submit(body);
    res.status(StatusCodes.ACCEPTED).json({ success: true, message: "Message sent" });
  }
}

export const contactController = new ContactController();
