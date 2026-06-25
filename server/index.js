import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js'
import specialitiesRoutes from './routes/specialitiesRoutes.js';
import vetsRoutes from './routes/vetsRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import blogsRoutes from './routes/blogsRoutes.js';
import faqsRoutes from './routes/faqsRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
//import auth from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
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
app.use('/api/contact', contactRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/banners', bannerRoutes);

//Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running'});
});

//Start Server
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});