import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../middlewares/auth.middleware", () => ({
  authMiddleware: (_req: unknown, _res: unknown, next: () => void) => next(),
  requireAuthenticatedUser: (req: { authUser?: { userId: string; role: string } }, _res: unknown, next: () => void) => {
    req.authUser = { userId: "u1", role: "ADMIN" };
    next();
  },
  ensureActiveUser: (_req: unknown, _res: unknown, next: () => void) => next(),
  ensureVerifiedUser: (_req: unknown, _res: unknown, next: () => void) => next()
}));

vi.mock("../middlewares/rbac.middleware", () => ({
  requireRoles:
    () =>
    (_req: unknown, _res: unknown, next: () => void) =>
      next()
}));

const adminOverviewSpy = vi.fn(async (_req, res) => res.status(200).json({ success: true, data: { totals: {} } }));

vi.mock("../modules/analytics/analytics.controller", () => ({
  analyticsController: {
    userOverview: vi.fn(async (_req, res) => res.status(200).json({ success: true })),
    adminOverview: adminOverviewSpy
  }
}));

describe("Analytics routes", () => {
  it("GET /analytics/admin/overview returns analytics", async () => {
    const { analyticsRouter } = await import("../modules/analytics/analytics.routes");
    const app = express();
    app.use("/analytics", analyticsRouter);

    const res = await request(app).get("/analytics/admin/overview?days=7");
    expect(res.status).toBe(200);
    expect(adminOverviewSpy).toHaveBeenCalledTimes(1);
  });
});
