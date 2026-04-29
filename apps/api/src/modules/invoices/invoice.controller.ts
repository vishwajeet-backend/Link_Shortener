import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { invoiceService } from "./invoice.service";
import type { ListInvoicesQuery } from "./invoice.types";

export class InvoiceController {
  async listMyInvoices(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as ListInvoicesQuery;
    const data = await invoiceService.listUserInvoices(req.authUser!.userId, query);
    res.status(StatusCodes.OK).json({ success: true, data });
  }

  async listAllInvoices(req: Request, res: Response): Promise<void> {
    const query = req.query as unknown as ListInvoicesQuery;
    const data = await invoiceService.listAllInvoices(query);
    res.status(StatusCodes.OK).json({ success: true, data });
  }
}

export const invoiceController = new InvoiceController();
