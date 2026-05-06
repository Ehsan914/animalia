import express from "express";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', async(req, res) => {

    try {
        const reviews = await prisma.review.findMany({
            where: {
                published: true
            }
        })

        res.json(reviews);

    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

router.post('/', async(req, res) => {
    
    const {author, text, rating} = req.body;

    try {
        if (!author || !text || !rating) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const review = await prisma.review.create({
            data: {
                author,
                text,
                rating,
                status: "pending"
            }
        })

        res.status(201).json(review);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/admin', auth, async(req, res) => {
    
    try {
        const allReviews = await prisma.review.findMany({

        });
        res.json(allReviews);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
})

router.post('/admin', auth, async(req, res) => {
    
    const {author, text} = req.body;
    const rating = parseFloat(req.body.rating); // or parseInt
    if (isNaN(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ message: "Invalid rating value" });
    }

    try {
        if (!author || !text || !rating) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const review = await prisma.review.create({
            data: {
                author,
                text,
                rating,
                status: "approved",
                published: published ?? false,
            }
        })

        res.status(201).json(review);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/:id", auth, async(req, res) => {
    
    const {author, text, rating, status, published} = req.body;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const updatedReview = await prisma.review.update({
            where: {
                id: id
            },
            data: {
                author,
                text,
                rating,
                status,
                published
            }
        })

        res.status(200).json(updatedReview);
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Review not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:id", auth, async(req, res) => {
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        await prisma.review.delete({
            where: {
                id: id
            }
        })

        res.status(200).json({ message: "Review deleted" });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Review not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;