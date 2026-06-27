import express from "express";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// The clinic operates in Bangladesh (UTC+6). The admin date picker sends plain
// calendar days ("YYYY-MM-DD"), so we anchor them to clinic-local day boundaries
// — not UTC — otherwise a banner reads as starting/ending 6 hours off.
const CLINIC_TZ_OFFSET = "+06:00";

// Normalises a "YYYY-MM-DD" (or full ISO) string into a Date. `endOfDay` pushes
// a bare calendar day to 23:59:59.999 so the end date is inclusive of that day.
const parseDate = (value, endOfDay = false) => {
    if (!value) return null;
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
    const iso = dateOnly
        ? `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}${CLINIC_TZ_OFFSET}`
        : value;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
};

const validate = (body) => {
    const { title, description, imageUrl, startDate, endDate } = body;
    if (!title || !title.trim()) return "Title is required";
    if (!description || !description.trim()) return "Description is required";
    if (!imageUrl || !imageUrl.trim()) return "Image URL is required";
    const start = parseDate(startDate);
    const end = parseDate(endDate, true);
    if (!start) return "Valid start date is required";
    if (!end) return "Valid end date is required";
    if (end < start) return "End date must be on or after the start date";
    return null;
};

// Accepts partnerLogos as an array or a newline/comma separated string.
const normaliseLogos = (logos) => {
    if (Array.isArray(logos)) return logos.map((s) => String(s).trim()).filter(Boolean);
    if (typeof logos === "string") {
        return logos.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    }
    return [];
};

const toData = (body) => ({
    title: body.title.trim(),
    description: body.description.trim(),
    location: (body.location || "").trim(),
    mapUrl: (body.mapUrl || "").trim(),
    imageUrl: body.imageUrl.trim(),
    partnerLogos: normaliseLogos(body.partnerLogos),
    startDate: parseDate(body.startDate),
    endDate: parseDate(body.endDate, true),
    startTime: (body.startTime || "").trim(),
    endTime: (body.endTime || "").trim(),
    active: Boolean(body.active),
});

// Public — the single hero banner to show right now: active AND not yet ended
// (end date is today or in the future). The start date is display-only, so an
// upcoming campaign shows immediately; it only disappears once it has ended.
router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const banner = await prisma.heroBanner.findFirst({
            where: {
                active: true,
                endDate: { gte: now },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.set('Cache-Control', 'public, max-age=60');
        res.json(banner);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

// Admin — all hero banners
router.get('/admin', auth, async (req, res) => {
    try {
        const banners = await prisma.heroBanner.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(banners);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

router.post('/', auth, async (req, res) => {
    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });

    try {
        const banner = await prisma.heroBanner.create({ data: toData(req.body) });

        // Only one hero banner can be live at a time.
        if (banner.active) {
            await prisma.heroBanner.updateMany({
                where: { id: { not: banner.id }, active: true },
                data: { active: false },
            });
        }

        res.status(201).json(banner);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/:id', auth, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });

    try {
        const banner = await prisma.heroBanner.update({
            where: { id },
            data: toData(req.body),
        });

        if (banner.active) {
            await prisma.heroBanner.updateMany({
                where: { id: { not: banner.id }, active: true },
                data: { active: false },
            });
        }

        res.status(200).json(banner);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Hero banner not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/:id', auth, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
        await prisma.heroBanner.delete({ where: { id } });
        res.status(200).json({ message: "Hero banner deleted" });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Hero banner not found!" });
        }
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
