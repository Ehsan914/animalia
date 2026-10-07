import { Toolbox, CalendarCheck, Star, Stethoscope } from "lucide-react";
import DashboardCards from "./DashboardCards";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { services, vets, reviews, appointments } from "../api/resources";
import EntityTable from "./EntityTable";
import StarRating from "./StarRating";
import { REVIEW_STATUS_LABEL, APPOINTMENT_STATUS_LABEL, serviceTitles } from "./records";
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
    { key: "author", label: "NAME" },
    { key: "rating", label: "RATING", render: (row) => <StarRating rating={row.rating} /> },
    { key: "text",   label: "COMMENT" },
    { key: "status", label: "STATUS", render: (row) => REVIEW_STATUS_LABEL[row.status] },
];

const APPOINTMENTCOLUMNS = [
    { key: "pet_name", label: "PET NAME" },
    { key: "name",     label: "OWNER NAME" },
    { key: "services", label: "SERVICES", render: serviceTitles },
    { key: "status",   label: "STATUS",   render: (row) => APPOINTMENT_STATUS_LABEL[row.status] },
];

// Dashboard

const Dashboard = () => {
    const [data, setData] = useState({ services: [], vets: [], reviews: [], appointments: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const sources = { services, vets, reviews, appointments };
        Promise.allSettled(Object.values(sources).map((resource) => resource.adminList()))
            .then((results) => {
                const loaded = {};
                Object.keys(sources).forEach((name, i) => {
                    const result = results[i];
                    if (result.status === "fulfilled") {
                        loaded[name] = result.value;
                    } else {
                        loaded[name] = [];
                        toast.error(`Could not load ${name}: ${result.reason.message}`);
                    }
                });
                setData(loaded);
                setLoading(false);
            });
    }, []);

    // Both lists come newest first from the server.
    const reviewRows      = data.reviews.slice(0, 5);
    const appointmentRows = data.appointments.slice(0, 5);

    return (
        <div className="flex flex-col gap-7.5 px-7.5 pb-10">
            {/* Header */}
            <div className="w-full flex flex-col px-7.5 py-7 gap-3 bg-mc-grass border-4 border-mc-primary shadow-mc-sharp-lg-b">
                <h1 className="font-pixel-alt text-[40px] text-white leading-10">DASHBOARD</h1>
                <p className="font-sans font-bold text-white text-[16px]">Welcome to your admin panel</p>
            </div>

            {/* Stat cards — equal width/height, responsive wrap */}
            <div className="flex flex-wrap gap-4">
                <DashboardCards
                    cardName="Total Services"
                    icon={<Toolbox size={22} />}
                    amount={data.services.length}
                    loading={loading}
                    onClick={() => navigate('/admin/services')}
                />
                <DashboardCards
                    cardName="Active Vets"
                    icon={<Stethoscope size={22} />}
                    amount={data.vets.length}
                    loading={loading}
                    onClick={() => navigate('/admin/vets')}
                />
                <DashboardCards
                    cardName="Total Reviews"
                    icon={<Star size={22} />}
                    amount={data.reviews.length}
                    loading={loading}
                    onClick={() => navigate('/admin/reviews')}
                    thisMonth={countThisMonth(data.reviews)}
                    pendingCount={countPending(data.reviews)}
                    pendingLabel="reviews"
                />
                <DashboardCards
                    cardName="Total Appointments"
                    icon={<CalendarCheck size={22} />}
                    amount={data.appointments.length}
                    loading={loading}
                    onClick={() => navigate('/admin/appointments')}
                    thisMonth={countThisMonth(data.appointments)}
                    pendingCount={countPending(data.appointments)}
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
