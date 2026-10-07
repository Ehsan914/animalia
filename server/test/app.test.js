import { beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { publicApi, resetDatabase, prisma } from "./helpers.js";

beforeEach(resetDatabase);

describe("login", () => {
    beforeEach(async () => {
        await prisma.admin.create({
            data: { email: "admin@example.com", passwordHash: await bcrypt.hash("correct horse", 4) },
        });
    });

    it("returns a token for valid credentials", async () => {
        const { body, headers } = await publicApi.post("/api/auth/login")
            .send({ email: "admin@example.com", password: "correct horse" })
            .expect(200);

        expect(body.token).toEqual(expect.any(String));
        expect(headers["cache-control"]).toBe("no-store");
    });

    it("gives the same answer for an unknown email and a wrong password", async () => {
        const unknown = await publicApi.post("/api/auth/login").send({ email: "who@example.com", password: "x" }).expect(401);
        const wrong = await publicApi.post("/api/auth/login").send({ email: "admin@example.com", password: "x" }).expect(401);

        expect(unknown.body).toEqual(wrong.body);
    });

    it("rejects a missing password before touching the database", async () => {
        const { body } = await publicApi.post("/api/auth/login").send({ email: "admin@example.com" }).expect(400);
        expect(body.message).toMatch(/^password:/);
    });
});

describe("app", () => {
    it("answers JSON 404 for unknown API routes", async () => {
        const { body } = await publicApi.get("/api/nope").expect(404);
        expect(body).toEqual({ message: "Not found" });
    });

    it("answers 400 for a malformed JSON body", async () => {
        await publicApi.post("/api/reviews").set("Content-Type", "application/json").send("{bad").expect(400);
    });

    it("answers 413, not 500, for an oversized body", async () => {
        const huge = JSON.stringify({ text: "x".repeat(200_000) });
        await publicApi.post("/api/reviews").set("Content-Type", "application/json").send(huge).expect(413);
    });

    it("reports health", async () => {
        await publicApi.get("/api/health").expect(200);
    });
});
