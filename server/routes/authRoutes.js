import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../prismaClient.js';
import { HttpError, parseBody } from '../lib/http.js';
import { loginLimit } from '../lib/rateLimits.js';

const router = express.Router();

// Compared against when the email is unknown, so every login costs one bcrypt
// check and the response time does not reveal which admin emails exist.
const DUMMY_HASH = bcrypt.hashSync("animalia-no-such-admin", 10);

const loginSchema = z.object({
    email: z.string().trim().min(1, "is required"),
    password: z.string().min(1, "is required"),
});

router.post('/login', loginLimit, async (req, res) => {
    res.set('Cache-Control', 'no-store');

    const { email, password } = parseBody(loginSchema, req.body);
    const user = await prisma.admin.findUnique({ where: { email } });

    // One answer, and one bcrypt check, for unknown email and wrong password.
    const matches = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    const isValid = user && matches;
    if (!isValid) throw new HttpError(401, "Invalid email or password");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
});

export default router;
