import express from "express";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const contact = await prisma.contact.findFirst({});
        res.status(200).json(contact);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
})

router.put('/', auth, async(req, res) => {
    const { phone, email } = req.body;

    if (!phone || !email) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const existing = await prisma.contact.findFirst()
        const contact = existing
            ? await prisma.contact.update({ where: { id: existing.id }, data: { phone, email } })
            : await prisma.contact.create({ data: { phone, email } })
        res.status(200).json(contact);

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
})

export default router;