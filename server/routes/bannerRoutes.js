import express from "express";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

const TYPES = ["info", "promo", "emergency"];

// Public — the single active banner to show (most recent), or null
router.get('/', async (req, res) => {
    try {
        const banner = await prisma.banner.findFirst({
            where: { active: true },
            orderBy: { createdAt: 'desc' },
        });
        res.set('Cache-Control', 'public, max-age=60');
        res.json(banner);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

// Admin — all banners
router.get('/admin', auth, async (req, res) => {
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(banners);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

router.post('/', auth, async (req, res) => {
    const { message, type, ctaLabel, ctaUrl, active } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({ message: "Message is required" });
    }
    if (type && !TYPES.includes(type)) {
        return res.status(400).json({ message: "Invalid banner type" });
    }

    try {
        const banner = await prisma.banner.create({
            data: {
                message: message.trim(),
                type: type || "promo",
                ctaLabel: ctaLabel || "",
                ctaUrl: ctaUrl || "",
                active: Boolean(active),
            },
        });

        // Only one banner can be live at a time.
        if (banner.active) {
            await prisma.banner.updateMany({
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
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const { message, type, ctaLabel, ctaUrl, active } = req.body;
    if (type && !TYPES.includes(type)) {
        return res.status(400).json({ message: "Invalid banner type" });
    }

    try {
        const banner = await prisma.banner.update({
            where: { id },
            data: { message, type, ctaLabel, ctaUrl, active },
        });

        // Only one banner can be live at a time.
        if (banner.active) {
            await prisma.banner.updateMany({
                where: { id: { not: banner.id }, active: true },
                data: { active: false },
            });
        }

        res.status(200).json(banner);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Banner not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/:id', auth, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    try {
        await prisma.banner.delete({ where: { id } });
        res.status(200).json({ message: "Banner deleted" });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Banner not found!" });
        }
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
