import express from "express";
import { z } from "zod";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";
import { HttpError, parseBody, text, optionalText } from "../lib/http.js";

const router = express.Router();
const PROFILE_ID = 1;

const phone = z.string().trim()
    .regex(/^\+[1-9]\d{7,14}$/, "use international format, e.g. +8801533829537");
const time = z.string().trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "use 24-hour HH:MM");
const httpsUrl = z.string().trim()
    .pipe(z.url({ protocol: /^https$/, message: "must be an https:// link" }));

// Parsed rather than prefix-matched, so "../" and "@host" tricks are caught.
const isGoogleMapsEmbed = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === "https:" && url.hostname === "www.google.com"
            && url.pathname.startsWith("/maps/embed");
    } catch {
        return false;
    }
};

const schema = z.object({
    phone,
    email: z.string().trim().pipe(z.email("must be a valid email")),
    emergencyPhone: phone,
    emergency24h: z.boolean(),
    whatsappNumber: phone,
    streetAddress: text(200),
    locality: text(100),
    postalCode: text(20),
    landmark: optionalText(200),
    directionsUrl: httpsUrl,
    // Rendered as an iframe on public pages, so only Google Maps embeds.
    mapEmbedUrl: z.string().trim().refine(isGoogleMapsEmbed, "must be a Google Maps embed link"),
    opensAt: time,
    closesAt: time,
    facebookUrl: z.union([z.literal(""), httpsUrl]).default(""),
});

const findProfile = async () => {
    const profile = await prisma.clinicProfile.findUnique({ where: { id: PROFILE_ID } });
    if (!profile) throw new HttpError(404, "Clinic profile not found");
    return profile;
};

router.get("/", async (req, res) => {
    const profile = await findProfile();
    res.set("Cache-Control", "public, max-age=300");
    res.json(profile);
});

// The admin editor reads uncached, so a saved change shows on the next visit.
router.get("/admin", auth, async (req, res) => {
    const profile = await findProfile();
    res.set("Cache-Control", "no-store");
    res.json(profile);
});

router.put("/", auth, async (req, res) => {
    const data = parseBody(schema, req.body);
    res.json(await prisma.clinicProfile.upsert({
        where: { id: PROFILE_ID },
        update: data,
        create: { id: PROFILE_ID, ...data },
    }));
});

export default router;
