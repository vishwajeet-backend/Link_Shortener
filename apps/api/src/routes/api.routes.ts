import { Router } from "express";
import { healthRouter } from "./health.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { userRouter } from "../modules/users/user.routes";
import { urlRouter } from "../modules/urls/url.routes";
import { redirectRouter } from "../modules/redirect/redirect.routes";
import { analyticsRouter } from "../modules/analytics/analytics.routes";
import { adminRouter } from "../modules/admin/admin.routes";

const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/urls", urlRouter);
apiRouter.use("/r", redirectRouter);
apiRouter.use("/analytics", analyticsRouter);
apiRouter.use("/admin", adminRouter);

export { apiRouter };
