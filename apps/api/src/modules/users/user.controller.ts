import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service";

export class UserController {
  async moduleHealth(_req: Request, res: Response): Promise<void> {
    const health = await userService.getModuleHealth();
    res.status(StatusCodes.OK).json({ success: true, data: health });
  }
}

export const userController = new UserController();
