import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

describe("Auth routes", () => {
  it(
    "POST /register validates payload",
    async () => {
    const { authRouter } = await import("../modules/auth/auth.routes");
    const app = express();
    app.use(express.json());
    app.use("/auth", authRouter);

    const res = await request(app).post("/auth/register").send({ email: "demo@x.com" });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    },
    20_000
  );
});
