import express from "express";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', auth, async(req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                services: {
                    include: {
                        service: true
                    }
                }
            }
        });
        res.json(appointments);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

router.post('/', async(req, res) => {
    const { name, phone, email, pet_name, species, serviceIds, message, date: rawDate } = req.body;

    const date = new Date(rawDate);
    if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date" });
    }

    if (!name || !phone || !email || !pet_name || !species || !date) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const appointment = await prisma.appointment.create({
            data: {
                name,
                phone,
                email,
                pet_name,
                species,
                date,
                message: message ?? "",
                vetComment: "",
                services: serviceIds?.length
                    ? {
                        create: serviceIds.map((serviceId) => ({ serviceId }))
                    }
                    : undefined,
            },
            include: {
                services: { include: { service: true } }
            }
        });
        res.status(201).json(appointment);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/admin', auth, async(req, res) => {
    const { name, phone, email, pet_name, species, serviceIds, message, vetComment, date: rawDate } = req.body;

    const date = new Date(rawDate);
    if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date" });
    }

    if (!name || !phone || !email || !pet_name || !species || !date) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const appointment = await prisma.appointment.create({
            data: {
                name,
                phone,
                email,
                pet_name,
                species,
                date,
                message: message ?? "",
                vetComment: vetComment ?? "",
                status: "approved",
                services: serviceIds?.length
                    ? {
                        create: serviceIds.map((serviceId) => ({ serviceId }))
                    }
                    : undefined,
            },
            include: {
                services: { include: { service: true } }
            }
        });
        res.status(201).json(appointment);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/:id', auth, async(req, res) => {
    const { status, vetComment } = req.body;

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const appointment = await prisma.appointment.update({
            where: { id },
            data: {
                ...(status     !== undefined && { status }),
                ...(vetComment !== undefined && { vetComment }),
            },
            include: {
                services: { include: { service: true } }
            }
        });
        res.status(200).json(appointment);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Appointment not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// Update linked services separately
router.put('/:id/services', auth, async(req, res) => {
    const { serviceIds } = req.body;

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    if (!Array.isArray(serviceIds)) {
        return res.status(400).json({ message: "serviceIds must be an array" });
    }

    try {
        // Replace all existing service links
        await prisma.appointmentService.deleteMany({ where: { appointmentId: id } });

        if (serviceIds.length > 0) {
            await prisma.appointmentService.createMany({
                data: serviceIds.map((serviceId) => ({ appointmentId: id, serviceId })),
            });
        }

        const updated = await prisma.appointment.findUnique({
            where: { id },
            include: { services: { include: { service: true } } }
        });

        res.status(200).json(updated);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Appointment not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/:id', auth, async(req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        await prisma.appointment.delete({ where: { id } });
        res.status(200).json({ message: "Appointment deleted" });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Appointment not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;