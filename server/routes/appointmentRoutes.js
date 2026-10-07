import express from "express";
import { z } from "zod";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";
import { parseBody, parseId, text, optionalText } from "../lib/http.js";
import { statusSchema } from "../lib/moderation.js";
import { requireHuman } from "../lib/turnstile.js";
import { formLimit } from "../lib/rateLimits.js";

const router = express.Router();

const serviceIds = z.array(z.coerce.number().int().positive()).max(50, "too many services");
const appointmentFields = {
    name: text(100),
    phone: text(30),
    email: z.string().trim().pipe(z.email("must be a valid email")),
    pet_name: text(100),
    species: text(50),
    date: z.coerce.date(),
    message: optionalText(2000),
};
const requestSchema = z.object({
    ...appointmentFields,
    serviceIds: serviceIds.min(1, "select at least one service"),
});
const adminSchema = z.object({
    ...appointmentFields,
    serviceIds: serviceIds.default([]),
    status: statusSchema,
    vetComment: optionalText(2000),
});
const statusChangeSchema = z.object({
    status: statusSchema,
    vetComment: z.string().trim().max(2000).optional(),
});

const include = { services: { include: { service: true } } };
const linkServices = (ids) => ({ create: ids.map((serviceId) => ({ serviceId })) });

router.get("/admin", auth, async (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(await prisma.appointment.findMany({ include, orderBy: { date: "desc" } }));
});

// Public booking request: always pending until the clinic confirms it.
router.post("/", formLimit(), requireHuman, async (req, res) => {
    const { serviceIds: ids, ...appointment } = parseBody(requestSchema, req.body);
    res.status(201).json(await prisma.appointment.create({
        data: { ...appointment, status: "pending", vetComment: "", services: linkServices(ids) },
        include,
    }));
});

router.post("/admin", auth, async (req, res) => {
    const { serviceIds: ids, ...appointment } = parseBody(adminSchema, req.body);
    res.status(201).json(await prisma.appointment.create({
        data: { ...appointment, services: linkServices(ids) },
        include,
    }));
});

// Full replace, services included, in one atomic write.
router.put("/:id", auth, async (req, res) => {
    const id = parseId(req.params.id);
    const { serviceIds: ids, ...appointment } = parseBody(adminSchema, req.body);
    res.json(await prisma.appointment.update({
        where: { id },
        data: { ...appointment, services: { deleteMany: {}, ...linkServices(ids) } },
        include,
    }));
});

// Confirm or cancel, optionally with the vet's note.
router.patch("/:id/status", auth, async (req, res) => {
    const id = parseId(req.params.id);
    const data = parseBody(statusChangeSchema, req.body);
    res.json(await prisma.appointment.update({ where: { id }, data, include }));
});

router.delete("/:id", auth, async (req, res) => {
    await prisma.appointment.delete({ where: { id: parseId(req.params.id) } });
    res.json({ message: "Deleted" });
});

export default router;
