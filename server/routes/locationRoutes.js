import express from "express";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const location = await prisma.location.findFirst({});
        res.status(200).json(location);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
})

router.put('/', auth, async(req, res) => {
    const { address, mapUrl } = req.body;

    if (!address || !mapUrl) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const location = await prisma.location.upsert({
            where: { id: 1 },
            update: { address, mapUrl },
            create: { address, mapUrl }
        });

        res.status(200).json(location);

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
})

export default router;