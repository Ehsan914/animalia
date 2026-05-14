import express from "express";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const emergencyContact = await prisma.emergencyContact.findFirst({});
        res.status(200).json(emergencyContact);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
})

router.put('/', auth, async(req, res) => {
    const { phone, available24h } = req.body;

    if (!phone || available24h === undefined) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const existing = await prisma.emergencyContact.findFirst()
        const emergencyContact = existing
            ? await prisma.emergencyContact.update({ where: { id: existing.id }, data: { phone, available24h } })
            : await prisma.emergencyContact.create({ data: { phone, available24h } })
        
        res.status(200).json(emergencyContact);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
})

export default router;