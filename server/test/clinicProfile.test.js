import { afterAll, describe, expect, it } from "vitest";
import { adminApi, publicApi, prisma } from "./helpers.js";

const original = await prisma.clinicProfile.findUnique({ where: { id: 1 } });
afterAll(() => prisma.clinicProfile.update({ where: { id: 1 }, data: original }));

const profileInput = (overrides = {}) => {
    // eslint-disable-next-line no-unused-vars
    const { id, updatedAt, ...fields } = original;
    return { ...fields, ...overrides };
};

describe("clinic profile", () => {
    it("is seeded by the migration and readable by anyone", async () => {
        const { body, headers } = await publicApi.get("/api/clinic-profile").expect(200);

        expect(body).toMatchObject({ id: 1, phone: "+8801533829537", whatsappNumber: "+8801879388068" });
        expect(headers["cache-control"]).toBe("public, max-age=300");
    });

    it("gives admins an uncached read", async () => {
        await publicApi.get("/api/clinic-profile/admin").expect(401);
        const { headers } = await adminApi.get("/api/clinic-profile/admin").expect(200);
        expect(headers["cache-control"]).toBe("no-store");
    });

    it("can only be changed by an admin", async () => {
        await publicApi.put("/api/clinic-profile").send(profileInput()).expect(401);
    });

    it("saves a valid profile", async () => {
        const { body } = await adminApi.put("/api/clinic-profile", profileInput({ phone: "+8801700000000" })).expect(200);
        expect(body.phone).toBe("+8801700000000");
    });

    it.each([
        ["phone", "01533829537", /^phone: use international format/],
        ["opensAt", "9am", /^opensAt: use 24-hour HH:MM/],
        ["directionsUrl", "http://maps.example", /^directionsUrl: must be an https/],
        ["mapEmbedUrl", "https://evil.example/embed", /^mapEmbedUrl: must be a Google Maps embed link/],
        ["mapEmbedUrl", "https://www.google.com/maps/embed/../../url?q=x", /^mapEmbedUrl: must be a Google Maps embed link/],
    ])("rejects an invalid %s", async (field, value, message) => {
        const { body } = await adminApi.put("/api/clinic-profile", profileInput({ [field]: value })).expect(400);
        expect(body.message).toMatch(message);
    });
});
