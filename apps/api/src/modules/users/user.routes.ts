import { Router } from "express";
import { asyncHandler } from "../../utils/async-handler";
import { userController } from "./user.controller";

const userRouter = Router();

userRouter.get("/health", asyncHandler((req, res) => userController.moduleHealth(req, res)));

export { userRouter };
