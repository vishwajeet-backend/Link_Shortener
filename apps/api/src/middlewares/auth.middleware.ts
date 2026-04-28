import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { USER_STATUS } from "../types/common";
import { verifyAccessToken } from "../utils/jwt";
import { userRepository } from "../repositories/user.repository";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Missing or invalid Authorization header"
    });
    return;
  }

  const accessToken = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = verifyAccessToken(accessToken);
    req.authUser = { userId: payload.userId, role: payload.role };
    next();
  } catch (_error) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Invalid or expired access token"
    });
  }
};

export const requireAuthenticatedUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.authUser) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required"
    });
    return;
  }

  next();
};

export const ensureActiveUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.authUser) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authentication required"
    });
    return;
  }

  const user = await userRepository.findById(req.authUser.userId);
  if (!user || user.status !== USER_STATUS.ACTIVE) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "User is not active"
    });
    return;
  }

  next();
};
