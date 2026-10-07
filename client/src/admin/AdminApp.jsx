import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import GuestRoute from "./GuestRoute";
import ServicesManager from "./ServicesManager";
import VetsManager from "./VetsManager";
import BlogsManager from "./BlogsManager";
import FAQsManager from "./FAQsManager";
import ReviewsManager from "./ReviewsManager";
import AppointmentsManager from "./AppointmentsManager";
import ClinicProfileManager from "./ClinicProfileManager";
import BannersManager from "./BannersManager";
import HeroBannersManager from "./HeroBannersManager";
import AdminLayout from "../layouts/AdminLayout";

const AdminApp = () => {
    return (
        <Routes>
            {/* Guest route - no sidebar */}
            <Route path="login" element={
                <GuestRoute>
                    <LoginPage />
                </GuestRoute>
            } />

            {/* All protected routes share the sidebar layout */}
            <Route element={
                <ProtectedRoute>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="services" element={<ServicesManager />} />
                <Route path="vets" element={<VetsManager />} />
                <Route path="blogs" element={<BlogsManager />} />
                <Route path="faqs" element={<FAQsManager />} />
                <Route path="reviews" element={<ReviewsManager />} />
                <Route path="clinic-profile" element={<ClinicProfileManager />} />
                <Route path="appointments" element={<AppointmentsManager />} />
                <Route path="banners" element={<BannersManager />} />
                <Route path="hero-banners" element={<HeroBannersManager />} />
            </Route>
        </Routes>
    );
};

export default AdminApp;