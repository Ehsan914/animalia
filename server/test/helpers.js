import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../app.js";
import prisma from "../prismaClient.js";

export { prisma };

// Anonymous requests: publicApi.get("/api/services")
export const publicApi = request(app);

// Requests carrying a valid admin token.
const bearer = () => `Bearer ${jwt.sign({ id: 1 }, process.env.JWT_SECRET)}`;
export const adminApi = {
    get: (url) => publicApi.get(url).set("Authorization", bearer()),
    post: (url, body) => publicApi.post(url).set("Authorization", bearer()).send(body),
    put: (url, body) => publicApi.put(url).set("Authorization", bearer()).send(body),
    patch: (url, body) => publicApi.patch(url).set("Authorization", bearer()).send(body),
    delete: (url) => publicApi.delete(url).set("Authorization", bearer()),
};

// Empties every table except the migration log and the clinic profile row.
export const resetDatabase = () => prisma.$executeRawUnsafe(`
    TRUNCATE TABLE appointment_services, appointments, reviews, "_SpecialityToVet",
        vets, specialities, services, blogs, faqs, banners, hero_banners, admins
    RESTART IDENTITY CASCADE
`);

export const serviceInput = (overrides = {}) => ({
    title: "Vaccination",
    short_desc: "Core vaccines",
    description: "Full vaccination programme",
    price: 500,
    img_url: "https://example.com/v.jpg",
    features: ["Rabies"],
    icon_key: "syringe",
    order: 1,
    ...overrides,
});

export const createService = async (overrides) =>
    (await adminApi.post("/api/services", serviceInput(overrides)).expect(201)).body;
