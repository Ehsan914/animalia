import { Toolbox, CalendarCheck, Star, Stethoscope } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import DashboardCards from "./DashboardCards";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { getServices } from "../api/services";
import { getVets } from "../api/vets";
import { getAllReviews } from "../api/misc";
import { getAppointments } from "../api/appointments";
import EntityTable from "./EntityTable";
import { PixelHeart } from "../components/icons/pixel-icons";
import { useNavigate } from "react-router-dom";

// helpers 

const THIS_MONTH = (() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
})();

/** Count items whose createdAt (or date) falls in the current calendar month */
const countThisMonth = (items) =>
    items.filter((item) => {
        const raw = item.createdAt ?? item.date ?? null;
        if (!raw) return false;
        const d = new Date(raw);
        return d.getMonth() === THIS_MONTH.month && d.getFullYear() === THIS_MONTH.year;
    }).length;

/** Count items with status === "pending" */
const countPending = (items) => items.filter((i) => i.status === "pending").length;

// columns

const REVIEWCOLUMNS = [
    { key: "author",      label: "NAME" },
    { key: "ratingLabel", label: "RATING", render: (row) => <StarRating rating={row.rating} /> },
    { key: "text",        label: "COMMENT" },
    { key: "statusLabel", label: "STATUS" },
];

const APPOINTMENTCOLUMNS = [
    { key: "pet_name",      label: "PET NAME" },
    { key: "name",          label: "OWNER NAME" },
    { key: "servicesLabel", label: "SERVICES", truncate: true },
    { key: "statusLabel",   label: "STATUS" },
];

// formatters

const formatReview = (r) => ({
    ...r,
    ratingLabel: `${r.rating}`,
    statusLabel:
        r.status === "approved" ? "Approved"
        : r.status === "rejected" ? "Rejected"
        : "Pending",
});

const formatAppointment = (apt) => {
    const serviceItems = apt.services ?? [];
    const serviceTitles = serviceItems
        .map((s) => s.service?.title ?? s.title ?? "")
        .filter(Boolean);
    const serviceIds = serviceItems
        .map((s) => s.serviceId ?? s.service?.id ?? s.id)
        .filter((id) => id != null);

    return {
        ...apt,
        serviceIds,
        servicesLabel: serviceTitles.length > 0 ? serviceTitles.join(", ") : "—",
        statusLabel:
            apt.status === "approved" ? "Confirmed"
            : apt.status === "rejected" ? "Cancelled"
            : "Pending",
    };
};

// sub-components

const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
            <PixelHeart
                key={i}
                className={`w-4 h-4 ${i <= rating ? "text-mc-heart" : "text-gray-300"}`}
            />
        ))}
    </div>
);

// Dashboard

const Dashboard = () => {
    const [services,     setServices]     = useState([]);
    const [vets,         setVets]         = useState([]);
    const [reviews,      setReviews]      = useState([]);
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();
    const { execute, loading } = useFetch();

    useEffect(() => { execute(getServices).then(setServices);         }, [execute]);
    useEffect(() => { execute(getVets).then(setVets);                 }, [execute]);
    useEffect(() => { execute(getAllReviews).then(setReviews);        }, [execute]);
    useEffect(() => { execute(getAppointments).then(setAppointments); }, [execute]);

    // derived values
    const reviewRows      = reviews     .slice(-5).map(formatReview);
    const appointmentRows = appointments.slice(-5).map(formatAppointment);

    const reviewsThisMonth      = countThisMonth(reviews);
    const appointmentsThisMonth = countThisMonth(appointments);

    const reviewsPending      = countPending(reviews);
    const appointmentsPending = countPending(appointments);


    return (
        <div className="flex flex-col gap-7.5 px-7.5 pb-10">
            {/* Header */}
            <div className="w-full flex flex-col px-7.5 py-7 gap-3 bg-mc-grass border-4 border-mc-primary shadow-mc-sharp-lg-b">
                <h1 className="font-pixel-alt text-[40px] leading-10">DASHBOARD</h1>
                <p className="font-sans font-bold text-[16px]">Welcome to your admin panel</p>
            </div>

            {/* Stat cards — equal width/height, responsive wrap */}
            <div className="flex flex-wrap gap-4">
                <DashboardCards
                    cardName="Total Services"
                    icon={<Toolbox size={22} />}
                    amount={services.length}
                    loading={loading}
                    onClick={() => navigate('/admin/services')}
                />
                <DashboardCards
                    cardName="Active Vets"
                    icon={<Stethoscope size={22} />}
                    amount={vets.length}
                    loading={loading}
                    onClick={() => navigate('/admin/vets')}
                />
                <DashboardCards
                    cardName="Total Reviews"
                    icon={<Star size={22} />}
                    amount={reviews.length}
                    loading={loading}
                    onClick={() => navigate('/admin/reviews')}
                    thisMonth={reviewsThisMonth}
                    pendingCount={reviewsPending}
                    pendingLabel="reviews"
                />
                <DashboardCards
                    cardName="Total Appointments"
                    icon={<CalendarCheck size={22} />}
                    amount={appointments.length}
                    loading={loading}
                    onClick={() => navigate('/admin/appointments')}
                    thisMonth={appointmentsThisMonth}
                    pendingCount={appointmentsPending}
                    pendingLabel="appointments"
                />
            </div>

            {/* Recent Reviews — last 5 */}
            <div className="flex flex-col gap-4">
                <h2 className="font-pixel-alt font-bold text-[26px]">Recent Reviews</h2>
                <EntityTable
                    columns={REVIEWCOLUMNS}
                    rows={reviewRows}
                    loading={loading}
                    className="shadow-mc-sharp-lg-b"
                />
            </div>

            {/* Recent Appointments — last 5 */}
            <div className="flex flex-col gap-4">
                <h2 className="font-pixel-alt font-bold text-[26px]">Recent Appointments</h2>
                <EntityTable
                    columns={APPOINTMENTCOLUMNS}
                    rows={appointmentRows}
                    loading={loading}
                    className="shadow-mc-sharp-lg-b"
                />
            </div>
        </div>
    );
};

export default Dashboard;