import { Router } from "express";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { asyncHandler } from "../../utils/async-handler";
import { contactController } from "./contact.controller";
import { contactSubmitSchema } from "./contact.validation";

const contactRouter = Router();

contactRouter.post(
  "/",
  validationMiddleware(contactSubmitSchema),
  asyncHandler((req, res) => contactController.submit(req, res))
);

export { contactRouter };
