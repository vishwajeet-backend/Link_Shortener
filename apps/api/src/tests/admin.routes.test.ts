import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../middlewares/auth.middleware", () => ({
  authMiddleware: (_req: unknown, _res: unknown, next: () => void) => next(),
  requireAuthenticatedUser: (req: { authUser?: { userId: string; role: string } }, _res: unknown, next: () => void) => {
    req.authUser = { userId: "admin1", role: "ADMIN" };
    next();
  },
  ensureActiveUser: (_req: unknown, _res: unknown, next: () => void) => next()
}));

vi.mock("../middlewares/rbac.middleware", () => ({
  requireRoles:
    () =>
    (_req: unknown, _res: unknown, next: () => void) =>
      next()
}));

const banSpy = vi.fn(async (_req, res) => res.status(200).json({ success: true, data: { status: "BANNED" } }));

vi.mock("../modules/admin/admin.controller", () => ({
  adminController: {
    listUsers: vi.fn(async (_req, res) => res.status(200).json({ success: true })),
    banUser: banSpy,
    deleteUser: vi.fn(async (_req, res) => res.status(200).json({ success: true })),
    listUrls: vi.fn(async (_req, res) => res.status(200).json({ success: true })),
    pauseUrl: vi.fn(async (_req, res) => res.status(200).json({ success: true })),
    activateUrl: vi.fn(async (_req, res) => res.status(200).json({ success: true })),
    deleteUrl: vi.fn(async (_req, res) => res.status(200).json({ success: true }))
  }
}));

describe("Admin routes", () => {
  it("POST /admin/users/:id/ban bans a user", async () => {
    const { adminRouter } = await import("../modules/admin/admin.routes");
    const app = express();
    app.use(express.json());
    app.use("/admin", adminRouter);

    const res = await request(app).post("/admin/users/user_1/ban");
    expect(res.status).toBe(200);
    expect(banSpy).toHaveBeenCalledTimes(1);
  });
});
