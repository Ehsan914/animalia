import { Routes, Route, Navigate } from "react-router-dom"
import { Helmet } from "react-helmet-async"
import LoginPage from "./LoginPage"
import ProtectedRoute from "./ProtectedRoute"
import GuestRoute from "./GuestRoute"
import Dashboard from "./Dashboard"
import ServicesManager from "./ServicesManager"
import VetsManager from "./VetsManager"
import BlogsManager from "./BlogsManager"
import FAQsManager from "./FAQsManager"
import ReviewsManager from "./ReviewsManager"
import AppointmentsManager from "./AppointmentsManager"
import ClinicProfileManager from "./ClinicProfileManager"
import BannersManager from "./BannersManager"
import HeroBannersManager from "./HeroBannersManager"
import FeedbackLayer from "./FeedbackLayer"
import AdminLayout from "../layouts/AdminLayout"
import "../styles/admin.css"

// Everything under /admin. The .admin root scopes admin.css; the toast and the
// confirm dialog live inside it so they share the admin's styles.
const AdminApp = () => {
    return (
        <div className="admin">
            <Helmet>
                <meta name="robots" content="noindex" />
            </Helmet>
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
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Route>
            </Routes>
            <FeedbackLayer />
        </div>
    )
}

export default AdminApp
