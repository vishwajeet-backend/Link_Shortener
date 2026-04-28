import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { Role } from "../types/common";

export const requireRoles =
  (...allowedRoles: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.authUser) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required"
      });
      return;
    }

    if (!allowedRoles.includes(req.authUser.role)) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Insufficient role permissions"
      });
      return;
    }

    next();
  };
