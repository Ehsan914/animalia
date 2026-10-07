import { beforeEach, describe, expect, it } from "vitest";
import { adminApi, publicApi, resetDatabase } from "./helpers.js";

beforeEach(resetDatabase);

describe("banners", () => {
    const bannerInput = (message, active = true) => ({ message, type: "promo", active });

    it("keeps a single banner live", async () => {
        const { body: first } = await adminApi.post("/api/banners", bannerInput("First")).expect(201);
        await adminApi.post("/api/banners", bannerInput("Second")).expect(201);

        const { body: all } = await adminApi.get("/api/banners/admin");
        const { body: live } = await publicApi.get("/api/banners").expect(200);

        expect(all.find((b) => b.id === first.id).active).toBe(false);
        expect(live.message).toBe("Second");
    });

    it("reactivating an older banner hides the newer one", async () => {
        const { body: first } = await adminApi.post("/api/banners", bannerInput("First"));
        await adminApi.post("/api/banners", bannerInput("Second"));

        await adminApi.put(`/api/banners/${first.id}`, bannerInput("First")).expect(200);
        const { body: all } = await adminApi.get("/api/banners/admin");

        expect(all.filter((b) => b.active).map((b) => b.message)).toEqual(["First"]);
    });

    it("answers null when nothing is live and rejects unknown types", async () => {
        const { body } = await publicApi.get("/api/banners").expect(200);
        expect(body).toBeNull();
        await adminApi.post("/api/banners", { message: "x", type: "sale" }).expect(400);
    });
});

describe("hero banners", () => {
    const heroInput = (overrides = {}) => ({
        title: "Free Rabies Vaccination",
        description: "All week",
        imageUrl: "https://drive.google.com/file/d/abc/view",
        partnerLogos: "https://a.example\nhttps://b.example, https://c.example",
        startDate: "2099-11-01",
        endDate: "2099-11-05",
        active: true,
        ...overrides,
    });

    it("anchors calendar days to clinic time with an inclusive end day", async () => {
        const { body } = await adminApi.post("/api/hero-banners", heroInput()).expect(201);

        expect(body.startDate).toBe("2099-10-31T18:00:00.000Z");
        expect(body.endDate).toBe("2099-11-05T17:59:59.999Z");
        expect(body.partnerLogos).toEqual(["https://a.example", "https://b.example", "https://c.example"]);
    });

    it("rejects an end date before the start date", async () => {
        const { body } = await adminApi.post("/api/hero-banners", heroInput({ endDate: "2099-10-01" })).expect(400);
        expect(body.message).toBe("endDate: must be on or after the start date");
    });

    it("hides a banner once it has ended", async () => {
        await adminApi.post("/api/hero-banners", heroInput({ startDate: "2020-01-01", endDate: "2020-01-02" })).expect(201);
        const { body } = await publicApi.get("/api/hero-banners").expect(200);
        expect(body).toBeNull();
    });

    it("shows the live banner that has not ended", async () => {
        await adminApi.post("/api/hero-banners", heroInput()).expect(201);
        const { body } = await publicApi.get("/api/hero-banners").expect(200);
        expect(body.title).toBe("Free Rabies Vaccination");
    });
});

describe("blogs", () => {
    const blogInput = (overrides = {}) => ({
        slug: "puppy-care",
        titleBn: "কুকুরছানার যত্ন",
        contentBn: "বিষয়বস্তু",
        categoryBn: "যত্ন",
        titleEn: "Puppy care",
        contentEn: "Content",
        categoryEn: "Care",
        author: "Dr. Easin",
        ...overrides,
    });

    it("keeps a new post as a draft unless it is published", async () => {
        await adminApi.post("/api/blogs", blogInput()).expect(201);
        await adminApi.post("/api/blogs", blogInput({ slug: "cat-care", published: true })).expect(201);

        const { body } = await publicApi.get("/api/blogs").expect(200);

        expect(body.map((b) => b.slug)).toEqual(["cat-care"]);
        await publicApi.get("/api/blogs/puppy-care").expect(404);
    });

    it("serves one language per request", async () => {
        await adminApi.post("/api/blogs", blogInput({ published: true }));

        const { body } = await publicApi.get("/api/blogs/puppy-care?lang=bn").expect(200);

        expect(body.titleBn).toBe("কুকুরছানার যত্ন");
        expect(body).not.toHaveProperty("titleEn");
    });

    it("is addressed by slug for updates and deletes", async () => {
        await adminApi.post("/api/blogs", blogInput());

        const { body } = await adminApi.put("/api/blogs/puppy-care", blogInput({ titleEn: "Puppy care, revised" })).expect(200);
        expect(body.titleEn).toBe("Puppy care, revised");

        await adminApi.delete("/api/blogs/puppy-care").expect(200);
        await adminApi.delete("/api/blogs/puppy-care").expect(404);
    });

    it("validates slugs and rejects duplicates", async () => {
        await adminApi.post("/api/blogs", blogInput({ slug: "Puppy Care!" })).expect(400);
        await adminApi.post("/api/blogs", blogInput({ slug: "admin" })).expect(400);
        await adminApi.post("/api/blogs", blogInput()).expect(201);
        await adminApi.post("/api/blogs", blogInput()).expect(409);
    });
});
