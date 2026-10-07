import { beforeEach, describe, expect, it } from "vitest";
import { adminApi, publicApi, resetDatabase, createService, serviceInput } from "./helpers.js";

beforeEach(resetDatabase);

describe("resource router (services)", () => {
    it("creates, lists in order and caches the public list", async () => {
        await createService({ title: "Second", order: 2 });
        await createService({ title: "First", order: 1 });

        const { body, headers } = await publicApi.get("/api/services").expect(200);

        expect(body.map((s) => s.title)).toEqual(["First", "Second"]);
        expect(headers["cache-control"]).toBe("public, max-age=600");
    });

    it("keeps writes and the admin list behind auth", async () => {
        await publicApi.post("/api/services").send(serviceInput()).expect(401);
        await publicApi.get("/api/services/admin").expect(401);
        await publicApi.get("/api/services/admin").set("Authorization", "Bearer forged").expect(401);
    });

    it("serves the admin list uncached", async () => {
        await createService();
        const { body, headers } = await adminApi.get("/api/services/admin").expect(200);
        expect(body).toHaveLength(1);
        expect(headers["cache-control"]).toBe("no-store");
    });

    it("reports the first invalid field", async () => {
        const { body } = await adminApi.post("/api/services", serviceInput({ title: "  " })).expect(400);
        expect(body.message).toBe("title: is required");
    });

    it("coerces empty numeric input and defaults the icon", async () => {
        const service = await createService({ price: "", icon_key: "" });
        expect(service).toMatchObject({ price: 0, icon_key: "stethoscope" });
    });

    it("replaces a record on update, order included", async () => {
        const service = await createService();

        const { body } = await adminApi.put(`/api/services/${service.id}`, serviceInput({ title: "Renamed", order: 4 })).expect(200);

        expect(body).toMatchObject({ title: "Renamed", order: 4 });
    });

    it("reorders atomically", async () => {
        const a = await createService({ title: "A", order: 1 });
        const b = await createService({ title: "B", order: 2 });

        await adminApi.put("/api/services/reorder", { items: [{ id: a.id, order: 2 }, { id: b.id, order: 1 }] }).expect(200);
        const { body } = await publicApi.get("/api/services");

        expect(body.map((s) => s.title)).toEqual(["B", "A"]);
    });

    it("rejects an empty or malformed reorder", async () => {
        await adminApi.put("/api/services/reorder", { items: [] }).expect(400);
        await adminApi.put("/api/services/reorder", {}).expect(400);
    });

    it("deletes, then answers 404 naming the model", async () => {
        const service = await createService();
        await adminApi.delete(`/api/services/${service.id}`).expect(200);

        const { body } = await adminApi.put(`/api/services/${service.id}`, serviceInput()).expect(404);
        expect(body.message).toBe("Service not found");
    });

    it("rejects an id that is not a whole number", async () => {
        const { body } = await adminApi.delete("/api/services/12abc").expect(400);
        expect(body.message).toBe("Invalid ID");
    });
});

describe("vets", () => {
    const vetInput = (specialityIds, overrides = {}) => ({
        name: "Dr. Easin",
        degree: "DVM",
        designation: "Lead Vet",
        short_bio: "Short",
        bio: "Long bio",
        img_url: "https://example.com/e.jpg",
        experience: 6,
        order: 1,
        specialityIds,
        ...overrides,
    });
    const speciality = async (name) => (await adminApi.post("/api/specialities", { name }).expect(201)).body;

    it("connects specialities on create and replaces them on update", async () => {
        const surgery = await speciality("Surgery");
        const dental = await speciality("Dental");

        const { body: vet } = await adminApi.post("/api/vets", vetInput([surgery.id])).expect(201);
        expect(vet.specialities.map((s) => s.name)).toEqual(["Surgery"]);

        const { body } = await adminApi.put(`/api/vets/${vet.id}`, vetInput([dental.id])).expect(200);
        expect(body.specialities.map((s) => s.name)).toEqual(["Dental"]);
    });

    it("accepts zero years of experience and an empty fun fact", async () => {
        const { body } = await adminApi.post("/api/vets", vetInput([], { experience: "" })).expect(201);
        expect(body).toMatchObject({ experience: 0, fun_fact: "" });
    });

    it("blames a deleted speciality, not the vet, when one is linked", async () => {
        const { body: vet } = await adminApi.post("/api/vets", vetInput([])).expect(201);

        const created = await adminApi.post("/api/vets", vetInput([9999])).expect(422);
        const updated = await adminApi.put(`/api/vets/${vet.id}`, vetInput([9999])).expect(422);

        expect(created.body.message).toBe(updated.body.message);
        expect(created.body.message).not.toMatch(/Vet not found/);
    });

    it("lists vets publicly with their specialities", async () => {
        const surgery = await speciality("Surgery");
        await adminApi.post("/api/vets", vetInput([surgery.id]));

        const { body } = await publicApi.get("/api/vets").expect(200);
        expect(body[0].specialities[0].name).toBe("Surgery");
    });
});

describe("specialities", () => {
    it("answers 409 for a duplicate name", async () => {
        await adminApi.post("/api/specialities", { name: "Surgery" }).expect(201);
        await adminApi.post("/api/specialities", { name: "Surgery" }).expect(409);
    });

    it("lists names alphabetically", async () => {
        await adminApi.post("/api/specialities", { name: "Surgery" });
        await adminApi.post("/api/specialities", { name: "Dental" });

        const { body } = await publicApi.get("/api/specialities").expect(200);
        expect(body.map((s) => s.name)).toEqual(["Dental", "Surgery"]);
    });
});

describe("faqs", () => {
    it("serves one language publicly, in order", async () => {
        const faq = (order) => ({ questionBn: `প্রশ্ন ${order}`, answerBn: "উত্তর", questionEn: `Q${order}`, answerEn: "A", order });
        await adminApi.post("/api/faqs", faq(2)).expect(201);
        await adminApi.post("/api/faqs", faq(1)).expect(201);

        const { body: english } = await publicApi.get("/api/faqs").expect(200);
        const { body: bangla } = await publicApi.get("/api/faqs?lang=bn").expect(200);

        expect(english.map((f) => f.questionEn)).toEqual(["Q1", "Q2"]);
        expect(Object.keys(bangla[0]).sort()).toEqual(["answerBn", "id", "questionBn"]);
    });
});
