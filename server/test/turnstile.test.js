import { beforeEach, describe, expect, it, vi } from "vitest";
import { adminApi, publicApi, resetDatabase, createService, prisma } from "./helpers.js";
import { HUMAN_TOKEN, TURNSTILE_TEST_SECRET, siteverify } from "./fakeTurnstile.js";

const review = (turnstileToken) => ({
    author: "Rahim", pet_name: "Milo", species: "Cat", text: "Great care", rating: 5, turnstileToken,
});

beforeEach(async () => {
    await resetDatabase();
    siteverify.mockClear();
});

describe("spam check on public forms", () => {
    it("refuses a submission without a token and never asks Cloudflare", async () => {
        const { body } = await publicApi.post("/api/reviews").send(review(undefined)).expect(403);

        expect(body.message).toMatch(/spam check/i);
        expect(siteverify).not.toHaveBeenCalled();
        expect(await prisma.review.count()).toBe(0);
    });

    it("refuses a token Cloudflare rejects", async () => {
        await publicApi.post("/api/reviews").send(review("bot")).expect(403);
        expect(await prisma.review.count()).toBe(0);
    });

    it("sends the secret and the token to Cloudflare, then saves", async () => {
        await publicApi.post("/api/reviews").send(review(HUMAN_TOKEN)).expect(201);

        const [url, { body }] = siteverify.mock.calls[0];
        expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
        expect(JSON.parse(body)).toEqual({ secret: TURNSTILE_TEST_SECRET, response: HUMAN_TOKEN });
    });

    it("answers 503, not 500, and saves nothing when Cloudflare is unreachable", async () => {
        siteverify.mockRejectedValueOnce(new TypeError("fetch failed"));

        const { body } = await publicApi.post("/api/reviews").send(review(HUMAN_TOKEN)).expect(503);

        expect(body.message).toMatch(/try again/i);
        expect(await prisma.review.count()).toBe(0);
    });

    it("answers 503 and logs it when the server's secret is wrong, instead of blaming the visitor", async () => {
        const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
        process.env.TURNSTILE_SECRET_KEY = "wrong-secret";
        try {
            await publicApi.post("/api/reviews").send(review(HUMAN_TOKEN)).expect(503);
        } finally {
            process.env.TURNSTILE_SECRET_KEY = TURNSTILE_TEST_SECRET;
        }

        expect(errorLog).toHaveBeenCalledWith(expect.stringMatching(/misconfigured/), ["invalid-input-secret"]);
        errorLog.mockRestore();
    });

    it("guards appointment requests too", async () => {
        const service = await createService();
        const request = {
            name: "Karim", phone: "01700000000", email: "karim@example.com", pet_name: "Rex",
            species: "Dog", date: "2026-11-01T04:00:00.000Z", serviceIds: [service.id],
        };

        await publicApi.post("/api/appointment").send(request).expect(403);
        await publicApi.post("/api/appointment").send({ ...request, turnstileToken: HUMAN_TOKEN }).expect(201);
    });

    it("leaves admin creates alone", async () => {
        await adminApi.post("/api/reviews/admin", { ...review(undefined), status: "approved" }).expect(201);
        expect(siteverify).not.toHaveBeenCalled();
    });
});
