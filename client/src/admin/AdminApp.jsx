import { Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import GuestRoute from "./GuestRoute";
import AdminSidebar from "./AdminSidebar";
import ServicesManager from "./ServicesManager";
import VetsManager from "./VetsManager";
import EmergencyManager from "./EmergencyManager";
import BlogsManager from "./BlogsManager";
import FAQsManager from "./FAQsManager";
import LocationsManager from "./LocationsManager";
import ReviewsManager from "./ReviewsManager";
import ContactsManager from "./ContactsManager";
import AppointmentsManager from "./AppointmentsManager";
import BannersManager from "./BannersManager";
import HeroBannersManager from "./HeroBannersManager";
import AdminTopbar from "./AdminTopbar";
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
                <Route path="emergency-contact" element={<EmergencyManager />} />
                <Route path="location" element={<LocationsManager />} />
                <Route path="reviews" element={<ReviewsManager />} />
                <Route path="contacts" element={<ContactsManager />} />
                <Route path="appointments" element={<AppointmentsManager />} />
                <Route path="banners" element={<BannersManager />} />
                <Route path="hero-banners" element={<HeroBannersManager />} />
            </Route>
        </Routes>
    );
};

export default AdminApp;