import express from "express";
import prisma from '../prismaClient.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', async(req, res) => {
        
    try {
        const services = await prisma.service.findMany({
            orderBy: {
                order: 'asc'
            }
        });

        res.json(services);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
})

router.post('/', auth, async(req, res) => {
    
    const { title, description, price, img_url, features } = req.body;

    const order = parseInt(req.body.order);
    if (isNaN(order) || order < 1) {
        return res.status(400).json({ message: "Invalid order value" });
    }

    try {

        //Validation
        if(!title || !description || !img_url || !features || order === undefined) {
            return res.status(400).json({ message: 'Missing required fields' }) 
        }

        const service = await prisma.service.create({
            data: {
                title,
                description, 
                price, 
                img_url, 
                features,
                order
            }
        })

        res.status(201).json(service)
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
})

// PUT /api/faqs/reorder
router.put('/reorder', auth, async(req, res) => {
    
    // expects body: { items: [{id: 1, order: 1}, {id: 2, order: 2}, ...] }
    const { items } = req.body;

    try {
        await prisma.$transaction(
            items.map(item => 
                prisma.service.update({
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
    
    const { title, description, price, img_url, features } = req.body;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const updatedService = await prisma.service.update({
            where: {
                id: id
            },
            data: {
                title,
                description, 
                price, 
                img_url, 
                features,
            }
        })

        res.status(200).json(updatedService)
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Service not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
})

router.delete('/:id', auth, async(req, res) => {
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        await prisma.service.delete({
            where: {
                id: id
            }
        });

        res.status(200).json({ message: "Service deleted!" });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Service not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" })
    }
})

export default router;