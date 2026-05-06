import express from "express";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', async(req, res) => {
    
    const lang = req.query.lang || "en";

    try {
        const blogs = await prisma.blog.findMany({
            where: {
                published: true
            }, 
            select: lang === 'bn' ? {
                titleBn: true,
                contentBn: true,
                categoryBn: true,
                slug: true,
                author: true
            } : {
                titleEn: true,
                contentEn: true,
                categoryEn: true,
                slug: true,
                author: true
            }
        });

        res.json(blogs);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

router.get('/admin', auth, async(req, res) => {
    
    try {
        const blogs = await prisma.blog.findMany({});
        
        res.json(blogs);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

router.get('/:slug', async(req, res) => {
    
    const lang = req.query.lang || "en";
    const {slug} = req.params;

    try {
        const blog = await prisma.blog.findUnique({
            where: {
                slug: slug
            }, 
            select: lang === 'bn' ? {
                titleBn: true,
                contentBn: true,
                categoryBn: true,
                slug: true,
                author: true,
                published: true
            } : {
                titleEn: true,
                contentEn: true,
                categoryEn: true,
                slug: true,
                author: true,
                published: true
            }
        });

        if (!blog || !blog.published) {
            return res.status(404).json({ message: "Blog not found!" });
        }

        res.json(blog);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
});

router.post('/', auth, async(req, res) => {
    const { slug, titleBn, contentBn, categoryBn, titleEn, contentEn, categoryEn, author } = req.body;

    try {
        if (!slug || !titleBn || !contentBn || !categoryBn || !titleEn || !contentEn || !categoryEn || !author) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const blog = await prisma.blog.create({
            data: {
                slug,
                titleBn,
                contentBn,
                categoryBn,
                titleEn,
                contentEn,
                categoryEn,
                author,
                published: true
            }
        });

        res.status(201).json(blog);

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/:slug', auth, async(req, res) => {
    
    const { titleBn, contentBn, categoryBn, titleEn, contentEn, categoryEn, author, published } = req.body;
    const { slug } = req.params;

    try {
        const blog = await prisma.blog.update({
            where: {
                slug: slug
            },
            data: {
                titleBn,
                contentBn,
                categoryBn,
                titleEn,
                contentEn,
                categoryEn,
                author,
                published
            }
        });

        res.status(200).json(blog);

    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Blog not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/:slug', auth, async(req, res) => {
    
    const { slug } = req.params;

    try {
        await prisma.blog.delete({
            where: {
                slug: slug
            }
        });

        res.status(200).json({ message: "Blog deleted" });

    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Blog not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;