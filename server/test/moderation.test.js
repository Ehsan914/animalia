import { beforeEach, describe, expect, it } from "vitest";
import { adminApi, publicApi, resetDatabase, createService, prisma } from "./helpers.js";
import { HUMAN_TOKEN } from "./fakeTurnstile.js";

beforeEach(resetDatabase);

const reviewInput = (overrides = {}) => ({
    author: "Rahim",
    pet_name: "Milo",
    species: "Cat",
    text: "Great care",
    rating: 5,
    turnstileToken: HUMAN_TOKEN,
    ...overrides,
});

const publicReviews = async () => (await publicApi.get("/api/reviews").expect(200)).body;

describe("reviews", () => {
    it("holds a public submission as pending and hidden, whatever the body claims", async () => {
        const { body } = await publicApi.post("/api/reviews")
            .send({ ...reviewInput(), status: "approved", published: true })
            .expect(201);

        expect(body).toMatchObject({ status: "pending", published: false });
        expect(await publicReviews()).toEqual([]);
    });

    it("rejects a rating outside 1–5", async () => {
        const { body } = await publicApi.post("/api/reviews").send(reviewInput({ rating: 6 })).expect(400);
        expect(body.message).toMatch(/^rating:/);
    });

    it("lets an admin create a published review including pet details", async () => {
        const { body } = await adminApi.post("/api/reviews/admin", { ...reviewInput(), status: "approved", published: true }).expect(201);

        expect(body).toMatchObject({ status: "approved", published: true, pet_name: "Milo", species: "Cat" });
        expect(await publicReviews()).toHaveLength(1);
    });

    it("never publishes a review that is not approved", async () => {
        const { body } = await adminApi.post("/api/reviews/admin", {
            ...reviewInput(), status: "pending", published: true,
        }).expect(201);

        expect(body.published).toBe(false);
    });

    it("takes a published review off the site when it is rejected", async () => {
        const { body: created } = await adminApi.post("/api/reviews/admin", { ...reviewInput(), status: "approved", published: true });

        const { body } = await adminApi.patch(`/api/reviews/${created.id}/status`, { status: "rejected" }).expect(200);

        expect(body).toMatchObject({ status: "rejected", published: false });
        expect(await publicReviews()).toEqual([]);
    });

    it("approves a submission without publishing it", async () => {
        const { body: created } = await publicApi.post("/api/reviews").send(reviewInput());

        const { body } = await adminApi.patch(`/api/reviews/${created.id}/status`, { status: "approved" }).expect(200);

        expect(body).toMatchObject({ status: "approved", published: false });
    });

    it("applies the publish rule to full edits", async () => {
        const { body: created } = await adminApi.post("/api/reviews/admin", { ...reviewInput(), status: "approved", published: true });

        const { body } = await adminApi.put(`/api/reviews/${created.id}`, {
            ...reviewInput({ text: "Edited" }), status: "rejected", published: true,
        }).expect(200);

        expect(body).toMatchObject({ text: "Edited", status: "rejected", published: false });
    });

    it("never approves an edit that leaves the status out", async () => {
        const { body: created } = await publicApi.post("/api/reviews").send(reviewInput());

        const { body } = await adminApi.put(`/api/reviews/${created.id}`, reviewInput()).expect(400);

        expect(body.message).toMatch(/^status:/);
        expect(await prisma.review.findUnique({ where: { id: created.id } })).toMatchObject({ status: "pending" });
    });

    it("rejects an unknown status", async () => {
        const { body: created } = await publicApi.post("/api/reviews").send(reviewInput());
        await adminApi.patch(`/api/reviews/${created.id}/status`, { status: "maybe" }).expect(400);
    });

    it("keeps moderation and the admin list behind auth", async () => {
        await publicApi.get("/api/reviews/admin").expect(401);
        await publicApi.patch("/api/reviews/1/status").send({ status: "approved" }).expect(401);
        await publicApi.post("/api/reviews/admin").send(reviewInput()).expect(401);
    });

    it("lists every review for admins, newest first", async () => {
        await publicApi.post("/api/reviews").send(reviewInput({ author: "First" }));
        await publicApi.post("/api/reviews").send(reviewInput({ author: "Second" }));

        const { body, headers } = await adminApi.get("/api/reviews/admin").expect(200);

        expect(body.map((r) => r.author)).toEqual(["Second", "First"]);
        expect(headers["cache-control"]).toBe("no-store");
    });

    it("deletes a review, then reports it missing", async () => {
        const { body: created } = await publicApi.post("/api/reviews").send(reviewInput());

        await adminApi.delete(`/api/reviews/${created.id}`).expect(200);
        const { body } = await adminApi.delete(`/api/reviews/${created.id}`).expect(404);

        expect(body.message).toBe("Review not found");
    });
});

describe("appointments", () => {
    const requestInput = (serviceIds, overrides = {}) => ({
        name: "Karim",
        phone: "01700000000",
        email: "karim@example.com",
        pet_name: "Rex",
        species: "Dog",
        date: "2026-11-01T04:00:00.000Z",
        message: "Limping",
        serviceIds,
        turnstileToken: HUMAN_TOKEN,
        ...overrides,
    });

    it("books a public request as pending with its services", async () => {
        const service = await createService();

        const { body } = await publicApi.post("/api/appointment")
            .send({ ...requestInput([service.id]), status: "approved" })
            .expect(201);

        expect(body).toMatchObject({ status: "pending", vetComment: "" });
        expect(body.services.map((s) => s.service.title)).toEqual(["Vaccination"]);
    });

    it("requires at least one service on a public request", async () => {
        const { body } = await publicApi.post("/api/appointment").send(requestInput([])).expect(400);
        expect(body.message).toMatch(/^serviceIds:/);
    });

    it("books a request without an email", async () => {
        const service = await createService();
        const { email: _omitted, ...withoutEmail } = requestInput([service.id]);

        const { body: missing } = await publicApi.post("/api/appointment").send(withoutEmail).expect(201);
        const { body: blank } = await publicApi.post("/api/appointment").send(requestInput([service.id], { email: " " })).expect(201);

        expect(missing.email).toBe("");
        expect(blank.email).toBe("");
    });

    it("rejects an invalid email or date", async () => {
        const service = await createService();
        await publicApi.post("/api/appointment").send(requestInput([service.id], { email: "nope" })).expect(400);
        await publicApi.post("/api/appointment").send(requestInput([service.id], { date: "soon" })).expect(400);
    });

    it("answers 422 for a service that does not exist", async () => {
        await publicApi.post("/api/appointment").send(requestInput([999])).expect(422);
    });

    it("saves every edited field, the vet comment and the services together", async () => {
        const first = await createService({ title: "Check-up" });
        const second = await createService({ title: "Surgery", order: 2 });
        const { body: created } = await adminApi.post("/api/appointment/admin", { ...requestInput([first.id]), status: "pending" });

        const { body } = await adminApi.put(`/api/appointment/${created.id}`, {
            ...requestInput([second.id], { name: "Karim Uddin", date: "2026-11-02T05:00:00.000Z" }),
            status: "approved",
            vetComment: "Bring previous X-rays",
        }).expect(200);

        expect(body).toMatchObject({
            name: "Karim Uddin",
            date: "2026-11-02T05:00:00.000Z",
            status: "approved",
            vetComment: "Bring previous X-rays",
        });
        expect(body.services.map((s) => s.serviceId)).toEqual([second.id]);
        expect(await prisma.appointmentService.count()).toBe(1);
    });

    it("confirms a request with the vet's note through the status endpoint", async () => {
        const service = await createService();
        const { body: created } = await publicApi.post("/api/appointment").send(requestInput([service.id]));

        const { body } = await adminApi.patch(`/api/appointment/${created.id}/status`, {
            status: "approved", vetComment: "See you Saturday",
        }).expect(200);

        expect(body).toMatchObject({ status: "approved", vetComment: "See you Saturday", name: "Karim" });
    });

    it("lists appointments for admins only, latest date first", async () => {
        const service = await createService();
        await publicApi.post("/api/appointment").send(requestInput([service.id], { date: "2026-11-01T04:00:00.000Z" }));
        await publicApi.post("/api/appointment").send(requestInput([service.id], { date: "2026-12-01T04:00:00.000Z" }));

        await publicApi.get("/api/appointment/admin").expect(401);
        const { body } = await adminApi.get("/api/appointment/admin").expect(200);

        expect(body.map((a) => a.date)).toEqual(["2026-12-01T04:00:00.000Z", "2026-11-01T04:00:00.000Z"]);
    });

    it("answers 404 for a missing appointment and 400 for a malformed id", async () => {
        await adminApi.patch("/api/appointment/999/status", { status: "approved" }).expect(404);
        await adminApi.delete("/api/appointment/12abc").expect(400);
    });
});
