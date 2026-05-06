import express from "express";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', async(req, res) => {
    
    const lang = req.query.lang || "en";

    try {
        const faqs = await prisma.faq.findMany({
            orderBy: {
                order: 'asc'
            },
            select: lang === 'bn' ? {
                questionBn: true,
                answerBn: true,
            } : {
                questionEn: true,
                answerEn: true,
            }
        });

        res.json(faqs);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

router.get('/admin', auth, async(req, res) => {
    
    try {
        const faqs = await prisma.faq.findMany({
            orderBy: {
                order: 'asc'
            }
        });

        res.json(faqs);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

router.post('/', auth, async(req, res) => {

    const { questionBn, answerBn, questionEn, answerEn } = req.body;
    const order = parseInt(req.body.order);
    if (isNaN(order) || order < 1) {
        return res.status(400).json({ message: "Invalid order value" });
    }

    try {

        if (!questionBn || !answerBn || !questionEn || !answerEn ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const faq = await prisma.faq.create({
            data: {
                questionBn,
                answerBn,
                questionEn,
                answerEn,
                order
            }
        });

        res.status(201).json(faq);
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
                prisma.faq.update({
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

    const { questionBn, answerBn, questionEn, answerEn } = req.body;
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const faq = await prisma.faq.update({
            where: {
                id: id
            },
            data: {
                questionBn,
                answerBn,
                questionEn,
                answerEn
            }
        });

        res.status(200).json(faq);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "FAQ not found!" });
        }
        res.status(500).json({ message: "Server error" });
    }
})

router.delete('/:id', auth, async(req, res) => {

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        await prisma.faq.delete({
            where: { id }
        });
        res.status(200).json({ message: "FAQ deleted" });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "FAQ not found!" });
        }
        res.status(500).json({ message: "Server error" });
    }
})


export default router;