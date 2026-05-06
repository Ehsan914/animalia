import express from "express";
import prisma from '../prismaClient.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/', async(req, res) => {
        
    try {
        const specialities = await prisma.speciality.findMany();

        res.json(specialities);
    } catch (err) {
        console.log(err.message);
        res.status(503).json({ message: "Service unavailable" });
    }
})

router.post('/', auth, async(req, res) => {
    
    const { name } = req.body;

    try {

        //Validation
        if(!name) {
            return res.status(400).json({ message: 'Name is required' }) 
        }

        const speciality = await prisma.speciality.create({
            data: {
                name
            }
        })

        res.status(201).json(speciality)
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" })
    }
})

router.put('/:id', auth, async(req, res) => {
    
    const { name } = req.body;
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const updatedSpeciality = await prisma.speciality.update({
            where: {
                id: id
            },
            data: {
                name
            }
        })

        res.status(200).json(updatedSpeciality)
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Speciality not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" })
    }
})

router.delete('/:id', auth, async(req, res) => {
    
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        await prisma.speciality.delete({
            where: {
                id: id
            }
        });

        res.status(200).json({ message: "Speciality deleted!" });
    } catch (err) {
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Speciality not found!" });
        }
        console.log(err.message);
        res.status(500).json({ message: "Server error" })
    }
})

export default router;
