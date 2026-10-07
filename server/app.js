import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import specialitiesRoutes from './routes/specialitiesRoutes.js';
import vetsRoutes from './routes/vetsRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import blogsRoutes from './routes/blogsRoutes.js';
import faqsRoutes from './routes/faqsRoutes.js';
import clinicProfileRoutes from './routes/clinicProfileRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import heroBannerRoutes from './routes/heroBannerRoutes.js';
import { errorHandler, originList } from './lib/http.js';

for (const name of ['JWT_SECRET', 'TURNSTILE_SECRET_KEY']) {
    if (!process.env[name]) throw new Error(`${name} is not set`);
}

const app = express();

// Railway's proxy sits in front of the app, so the visitor's address is the
// last X-Forwarded-For entry. Rate limits count per visitor because of this.
app.set('trust proxy', 1);

//Middleware
app.use(cors({
    origin: originList(process.env.CLIENT_URL),
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/specialities', specialitiesRoutes);
app.use('/api/vets', vetsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/faqs', faqsRoutes);
app.use('/api/clinic-profile', clinicProfileRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/hero-banners', heroBannerRoutes);

//Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running'});
});

app.use('/api', (req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

export default app;
