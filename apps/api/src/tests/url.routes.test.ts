import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

vi.mock("../middlewares/auth.middleware", () => ({
  authMiddleware: (_req: unknown, _res: unknown, next: () => void) => next(),
  requireAuthenticatedUser: (req: { authUser?: { userId: string; role: string } }, _res: unknown, next: () => void) => {
    req.authUser = { userId: "u1", role: "USER" };
    next();
  },
  ensureActiveUser: (_req: unknown, _res: unknown, next: () => void) => next()
}));

const listSpy = vi.fn(async (_req, res) => {
  res.status(200).json({ success: true, data: { items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } } });
});

vi.mock("../modules/urls/url.controller", () => ({
  urlController: {
    createOwnUrl: vi.fn(async (_req, res) => res.status(201).json({ success: true })),
    listOwnUrls: listSpy,
    getOwnUrlById: vi.fn(async (_req, res) => res.status(200).json({ success: true }))
  }
}));

describe("URL routes", () => {
  it("GET /urls returns paginated list", async () => {
    const { urlRouter } = await import("../modules/urls/url.routes");
    const app = express();
    app.use(express.json());
    app.use("/urls", urlRouter);

    const res = await request(app).get("/urls?page=1&limit=10");
    expect(res.status).toBe(200);
    expect(listSpy).toHaveBeenCalledTimes(1);
  });
});
