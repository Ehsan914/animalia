import express from "express";
import prisma from '../prismaClient.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', async(req, res) => {

    try {
        const vets = await prisma.vet.findMany({
            orderBy: {
                order: 'asc'
            },
            include: {
                specialities: true
            }
        })

        res.json(vets);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
    
});

router.post('/', auth, async(req, res) => {

    const { name, degree, designation, short_bio, bio, fun_fact, img_url, experience, specialityIds } = req.body;
    const order = parseInt(req.body.order);
    if (isNaN(order) || order < 1) {
        return res.status(400).json({ message: "Invalid order value" });
    }

    try {
        //Validation
        if (!name || !degree || !designation || !short_bio || !bio || !img_url || !experience || order === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const vet = await prisma.vet.create({
            data: {
                name, 
                degree, 
                designation,
                short_bio,
                bio, 
                fun_fact, 
                img_url, 
                experience, 
                specialities: specialityIds && specialityIds.length > 0 
                ? 
                {
                    connect: specialityIds.map(id => ({ id }))
                } : undefined,
                order
            }
        });

        res.status(201).json(vet);

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT /api/faqs/reorder
router.put('/reorder', auth, async(req, res) => {
    
    // expects body: { items: [{id: 1, order: 1}, {id: 2, order: 2}, ...] }
    const { items } = req.body;

    try {
        await prisma.$transaction(
            items.map(item => 
                prisma.vet.update({
                    where: { id: item.id },
                    data: { order: item.order }
                })
            )
        );

        res.status(200).json({ message: "Order updated" });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/:id', auth, async(req, res) => {
    
    const { name, degree, designation, short_bio, bio, fun_fact, img_url, experience, specialityIds } = req.body;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const updatedVet = await prisma.vet.update({
            where: {
                id: id
            },
            data: {
                name, 
                degree, 
                designation,
                short_bio,
                bio, 
                fun_fact, 
                img_url, 
                experience, 
                specialities: specialityIds && specialityIds.length > 0 
                ? 
                {
                    set: specialityIds.map(id => ({ id }))
                } : { set: []}
            },
            include: {
                specialities: true
            }
        });

        res.status(200).json(updatedVet);

    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Vet not found!" });
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
        await prisma.vet.delete({
            where: {
                id: id
            }
        });

        res.status(200).json({ message: "Vet deleted!" });

    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Vet not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;