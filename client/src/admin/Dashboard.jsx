import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import DashboardCards from "./DashboardCards"
import EntityTable from "./EntityTable"
import StarRating from "./StarRating"
import Chip from "./Chip"
import { BarsChart, ChartCard, ColumnsChart, DonutChart, StarsLabel } from "./DashboardCharts"
import { useReportPending, countPending } from "./pendingCounts"
import toast from "./feedback"
import { services, vets, reviews, appointments } from "../api/resources"
import { REVIEW_STATUS_LABEL, APPOINTMENT_STATUS_LABEL, STATUS_TONE, serviceTitles } from "./records"
import {
    STATUS_SERIES, appointmentDays, countThisMonth, newest, ratingAverage, ratingCounts, serviceCounts, statusParts,
} from "./dashboardData"

const REVIEW_COLUMNS = [
    { label: "Name",    key: "author" },
    { label: "Rating",  render: (r) => <StarRating rating={r.rating} /> },
    { label: "Comment", key: "text", truncate: true },
    { label: "Status",  render: (r) => <Chip tone={STATUS_TONE[r.status]}>{REVIEW_STATUS_LABEL[r.status]}</Chip> },
]

const APPOINTMENT_COLUMNS = [
    { label: "Pet name",   key: "pet_name" },
    { label: "Owner name", key: "name" },
    { label: "Services",   render: serviceTitles },
    { label: "Status",     render: (a) => <Chip tone={STATUS_TONE[a.status]}>{APPOINTMENT_STATUS_LABEL[a.status]}</Chip> },
]

const SOURCES = { services, vets, reviews, appointments }

function Recent({ title, linkLabel, to, columns, rows, loading }) {
    return (
        <section className="block">
            <header className="block-head"><h2>{title}</h2><Link className="text-link" to={to}>{linkLabel}</Link></header>
            <EntityTable columns={columns} rows={rows} loading={loading} />
        </section>
    )
}

const Dashboard = () => {
    const [data, setData] = useState({ services: [], vets: [], reviews: [], appointments: [] })
    const [loading, setLoading] = useState(true)
    useReportPending("reviews", data.reviews, loading)
    useReportPending("appointments", data.appointments, loading)

    useEffect(() => {
        const names = Object.keys(SOURCES)
        Promise.allSettled(names.map((name) => SOURCES[name].adminList()))
            .then((results) => {
                const loaded = {}
                names.forEach((name, i) => {
                    const result = results[i]
                    loaded[name] = result.status === "fulfilled" ? result.value : []
                    if (result.status === "rejected") toast.error(`Could not load ${name}: ${result.reason.message}`)
                })
                setData(loaded)
                setLoading(false)
            })
    }, [])

    const { reviews: allReviews, appointments: allAppointments } = data

    return (
        <>
            <header className="dash-band on-navy">
                <h1 className="page-name">Dashboard</h1>
                <p className="page-sub">Welcome to your admin panel</p>
            </header>

            <div className="stats">
                <DashboardCards name="Total Services" icon="stethoscope" amount={data.services.length} to="/admin/services" loading={loading} />
                <DashboardCards name="Vets" icon="user-circle" amount={data.vets.length} to="/admin/vets" loading={loading} />
                <DashboardCards
                    name="Total Reviews" icon="star" amount={allReviews.length} to="/admin/reviews" loading={loading}
                    thisMonth={countThisMonth(allReviews)} pendingCount={countPending(allReviews)} pendingLabel="reviews"
                />
                <DashboardCards
                    name="Total Appointments" icon="calendar-blank" amount={allAppointments.length} to="/admin/appointments" loading={loading}
                    thisMonth={countThisMonth(allAppointments)} pendingCount={countPending(allAppointments)} pendingLabel="appointments"
                />
            </div>

            <div className="charts">
                <ChartCard wide title="Appointments by day" sub="The past week and the week ahead">
                    <ColumnsChart days={appointmentDays(allAppointments)} series={STATUS_SERIES} unit="appointments" />
                </ChartCard>
                <ChartCard title="Appointment status" sub="All appointments">
                    <DonutChart parts={statusParts(allAppointments)} unit="appointments" />
                </ChartCard>
                <ChartCard title="Most booked services" sub="Across all appointments">
                    <BarsChart color="var(--navy)" rows={serviceCounts(allAppointments)} />
                </ChartCard>
                <ChartCard title="Ratings" sub={`${ratingAverage(allReviews)} average from ${allReviews.length} reviews`}>
                    <BarsChart
                        color="#d39b1d"
                        rows={ratingCounts(allReviews).map(({ stars, value }) => ({ key: stars, label: <StarsLabel stars={stars} />, value }))}
                    />
                </ChartCard>
            </div>

            <Recent title="Recent Reviews" linkLabel="All reviews" to="/admin/reviews" columns={REVIEW_COLUMNS} rows={newest(allReviews)} loading={loading} />
            <Recent title="Recent Appointments" linkLabel="All appointments" to="/admin/appointments" columns={APPOINTMENT_COLUMNS} rows={newest(allAppointments)} loading={loading} />
        </>
    )
}

export default Dashboard
