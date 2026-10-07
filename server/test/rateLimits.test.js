import { beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { publicApi, resetDatabase, createService, prisma } from "./helpers.js";
import { HUMAN_TOKEN, siteverify } from "./fakeTurnstile.js";

const LOGIN_FAILURES_ALLOWED = 10;
const FORM_SUBMISSIONS_ALLOWED = 10;

// Railway's proxy puts the visitor's address in X-Forwarded-For.
const from = (ip, req) => req.set("X-Forwarded-For", ip);
const login = (ip, password) =>
    from(ip, publicApi.post("/api/auth/login")).send({ email: "admin@example.com", password });
const review = (ip) => from(ip, publicApi.post("/api/reviews")).send({
    author: "Rahim", pet_name: "Milo", species: "Cat", text: "Great care", rating: 5, turnstileToken: HUMAN_TOKEN,
});

beforeEach(async () => {
    await resetDatabase();
    siteverify.mockClear();
    await prisma.admin.create({
        data: { email: "admin@example.com", passwordHash: await bcrypt.hash("correct horse", 4) },
    });
});

describe("login rate limit", () => {
    it("blocks a visitor after too many failed attempts", async () => {
        for (let i = 0; i < LOGIN_FAILURES_ALLOWED; i++) {
            await login("203.0.113.1", "wrong").expect(401);
        }

        const { body, headers } = await login("203.0.113.1", "correct horse").expect(429);

        expect(body.message).toMatch(/too many/i);
        expect(headers["retry-after"]).toBeDefined();
    });

    it("does not count successful logins", async () => {
        for (let i = 0; i < LOGIN_FAILURES_ALLOWED + 2; i++) {
            await login("203.0.113.1", "correct horse").expect(200);
        }
    });

    it("keeps a separate count for each visitor behind the proxy", async () => {
        for (let i = 0; i < LOGIN_FAILURES_ALLOWED; i++) {
            await login("203.0.113.1", "wrong").expect(401);
        }

        await login("203.0.113.1", "wrong").expect(429);
        await login("198.51.100.7", "correct horse").expect(200);
    });
});

describe("public form rate limit", () => {
    it("blocks a flood before it reaches the spam check or the database", async () => {
        for (let i = 0; i < FORM_SUBMISSIONS_ALLOWED; i++) {
            await review("203.0.113.1").expect(201);
        }

        await review("203.0.113.1").expect(429);

        expect(siteverify).toHaveBeenCalledTimes(FORM_SUBMISSIONS_ALLOWED);
        expect(await prisma.review.count()).toBe(FORM_SUBMISSIONS_ALLOWED);
    });

    it("counts reviews and appointments separately", async () => {
        for (let i = 0; i < FORM_SUBMISSIONS_ALLOWED; i++) {
            await review("203.0.113.1").expect(201);
        }
        const service = await createService();

        await from("203.0.113.1", publicApi.post("/api/appointment")).send({
            name: "Karim", phone: "01700000000", email: "karim@example.com", pet_name: "Rex",
            species: "Dog", date: "2026-11-01T04:00:00.000Z", serviceIds: [service.id], turnstileToken: HUMAN_TOKEN,
        }).expect(201);
    });
});
