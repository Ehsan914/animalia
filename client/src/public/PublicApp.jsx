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
import { PUBLIC_ROUTES } from "../routes/publicRoutes";

// The component for each page in PUBLIC_ROUTES.
const PAGES = {
    home: HomePage,
    services: ServicePage,
    vets: VetsPage,
    blog: BlogPage,
    blogPost: BlogDetailPage,
    about: AboutPage,
    contact: ContactPage,
    appointment: AppointmentPage,
};

const PublicApp = () => {
    return (
        <Routes>
            {PUBLIC_ROUTES.map(({ page, path }) => {
                const Page = PAGES[page];
                return <Route key={path} path={path} element={<Page />} />;
            })}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}
export default PublicApp
