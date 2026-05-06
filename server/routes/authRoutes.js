import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const router = express.Router();

router.post('/login', async(req, res) => {
    
    res.set('Cache-Control', 'no-store');

    const { email, password } = req.body;

    try {
        const user = await prisma.admin.findUnique({
            where: {
                email: email
            }
        })

        if (!user) { return res.status(404).send({ message: "Invalid Credentials" })}

        const passIsValid = bcrypt.compareSync(password, user.passwordHash);

        if (!passIsValid) { return res.status(401).send({ message: "Invalid password" }) }

        //console.log(user);

        const token = jwt.sign( {id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
        res.json({ token })

    } catch(err) {
        console.log(err.message);
        res.sendStatus(503);
    }
})

export default router;