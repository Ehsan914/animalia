import { Routes, Route } from "react-router-dom";
import HomePage from '../pages/HomePage';
import ServicePage from '../pages/ServicePage';
import VetsPage from '../pages/VetsPage';
import BlogPage from '../pages/BlogPage';
import BlogDetailPage from '../pages/BlogDetailPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';
import AppointmentPage from "../pages/AppointmentPage";

const PublicApp = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/vets" element={<VetsPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blogs/:slug" element={<BlogDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}
export default PublicApp