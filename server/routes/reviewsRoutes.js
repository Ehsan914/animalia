import express from "express";
import { z } from "zod";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";
import { parseBody, parseId, text } from "../lib/http.js";
import { statusSchema, reviewVisibility } from "../lib/moderation.js";
import { requireHuman } from "../lib/turnstile.js";
import { formLimit } from "../lib/rateLimits.js";

const router = express.Router();

const reviewFields = {
    author: text(100),
    pet_name: text(100),
    species: text(50),
    text: text(1000),
    rating: z.coerce.number().int().min(1).max(5),
};
const submissionSchema = z.object(reviewFields);
const adminSchema = z.object({
    ...reviewFields,
    status: statusSchema,
    published: z.boolean().default(false),
});
const statusChangeSchema = z.object({ status: statusSchema });

// Public: approved and published reviews only.
router.get("/", async (req, res) => {
    res.json(await prisma.review.findMany({
        where: { status: "approved", published: true },
        orderBy: { createdAt: "desc" },
    }));
});

// Public submission: always waits for moderation, hidden until approved.
router.post("/", formLimit(), requireHuman, async (req, res) => {
    const review = parseBody(submissionSchema, req.body);
    res.status(201).json(await prisma.review.create({
        data: { ...review, status: "pending", published: false },
    }));
});

router.get("/admin", auth, async (req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(await prisma.review.findMany({ orderBy: { createdAt: "desc" } }));
});

router.post("/admin", auth, async (req, res) => {
    const { status, published, ...review } = parseBody(adminSchema, req.body);
    res.status(201).json(await prisma.review.create({
        data: { ...review, ...reviewVisibility({ status, published }) },
    }));
});

router.put("/:id", auth, async (req, res) => {
    const id = parseId(req.params.id);
    const { status, published, ...review } = parseBody(adminSchema, req.body);
    res.json(await prisma.review.update({
        where: { id },
        data: { ...review, ...reviewVisibility({ status, published }) },
    }));
});

// Approve or reject. Leaving "approved" also takes the review off the site.
router.patch("/:id/status", auth, async (req, res) => {
    const id = parseId(req.params.id);
    const { status } = parseBody(statusChangeSchema, req.body);
    res.json(await prisma.review.update({
        where: { id },
        data: status === "approved" ? { status } : { status, published: false },
    }));
});

router.delete("/:id", auth, async (req, res) => {
    await prisma.review.delete({ where: { id: parseId(req.params.id) } });
    res.json({ message: "Deleted" });
});

export default router;
