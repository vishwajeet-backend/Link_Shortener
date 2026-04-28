import express from "express";
import request from "supertest";
import { describe, expect, it, vi } from "vitest";

const redirectSpy = vi.fn(async (_req, res) => res.redirect(302, "https://example.com"));

vi.mock("../modules/redirect/redirect.controller", () => ({
  redirectController: {
    redirectByShortCode: redirectSpy
  }
}));

describe("Redirect routes", () => {
  it("GET /r/:shortCode redirects", async () => {
    const { redirectRouter } = await import("../modules/redirect/redirect.routes");
    const app = express();
    app.use("/r", redirectRouter);

    const res = await request(app).get("/r/abc123xy");
    expect(res.status).toBe(302);
    expect(redirectSpy).toHaveBeenCalledTimes(1);
  });
});
