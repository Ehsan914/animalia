import { useEffect, useState } from "react"
import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import Chip from "./Chip"
import { PendingBlock, PendingCard, Fact } from "./PendingApprovals"
import { useReportPending } from "./pendingCounts"
import toast from "./feedback"
import { appointments, services } from "../api/resources"
import { localPhone } from "../utils/clinicProfile"
import {
    APPOINTMENT_STATUS_LABEL, STATUS_TONE, SPECIES_OPTIONS, statusChoices, serviceTitles,
    formatDate, formatLongDay, formatTime, toDateTimeInputs,
} from "./records"

const COLUMNS = [
    { label: "Pet name",   key: "pet_name" },
    { label: "Owner name", key: "name" },
    { label: "Services",   render: serviceTitles },
    { label: "Status",     render: (a) => <Chip tone={STATUS_TONE[a.status]}>{APPOINTMENT_STATUS_LABEL[a.status]}</Chip> },
    { label: "Date",       render: (a) => formatDate(a.date) },
    { label: "Time",       render: (a) => formatTime(a.date) },
]

const formFields = (serviceOptions) => [
    { name: "name",       label: "Owner Name",   required: true, max: 100 },
    { name: "phone",      label: "Phone Number", type: "tel", required: true, max: 30, half: true, placeholder: "+8801…" },
    { name: "email",      label: "Email",        type: "email", half: true },
    { name: "pet_name",   label: "Pet Name",     required: true, max: 100 },
    { name: "species",    label: "Species",      type: "options", required: true, options: SPECIES_OPTIONS },
    { name: "date",       label: "Date",         type: "date", required: true, half: true },
    { name: "time",       label: "Time",         type: "time", required: true, half: true },
    { name: "serviceIds", label: "Services",     type: "checks", required: true, options: serviceOptions },
    { name: "message",    label: "Message",      type: "textarea", rows: 3, max: 2000 },
    { name: "status",     label: "Status",       type: "options", required: true, options: statusChoices(APPOINTMENT_STATUS_LABEL) },
    { name: "vetComment", label: "Vet Comment",  type: "textarea", rows: 2, max: 2000, hint: "Sent to the owner with the decision." },
]

const emptyForm = () => ({
    name: "", phone: "", email: "", pet_name: "", species: "Dog",
    ...toDateTimeInputs(new Date().toISOString()), time: "10:00",
    serviceIds: [], message: "", status: "approved", vetComment: "",
})

const toForm = (apt) => ({
    name:       apt.name,
    phone:      apt.phone,
    email:      apt.email,
    pet_name:   apt.pet_name,
    species:    apt.species,
    ...toDateTimeInputs(apt.date),
    serviceIds: apt.services.map((link) => link.serviceId),
    message:    apt.message,
    status:     apt.status,
    vetComment: apt.vetComment,
})

// The form edits date and time separately, in the admin's local time.
const toPayload = ({ date, time, ...appointment }) => ({
    ...appointment,
    date: new Date(`${date}T${time}`).toISOString(),
})

const soonestFirst = (a, b) => new Date(a.date) - new Date(b.date)

const AppointmentsManager = () => {
    const manager = useEntityManager({ resource: appointments, label: "Appointment", emptyForm, toForm, toPayload })
    useReportPending("appointments", manager.rows, manager.loading)
    const [serviceOptions, setServiceOptions] = useState([])
    // Vet comments typed on pending cards, by appointment id, until decided.
    const [notes, setNotes] = useState({})

    useEffect(() => {
        services.adminList()
            .then((list) => setServiceOptions(list.map((s) => ({ value: s.id, label: s.title }))))
            .catch((err) => toast.error(`Could not load services: ${err.message}`))
    }, [])

    const pending = manager.rows.filter((a) => a.status === "pending").sort(soonestFirst)
    const noteFor = (apt) => notes[apt.id] ?? apt.vetComment

    const decide = (apt, accepted) => manager.changeWithUndo({
        run: () => appointments.setStatus(apt.id, { status: accepted ? "approved" : "rejected", vetComment: noteFor(apt).trim() }),
        undo: () => appointments.setStatus(apt.id, { status: apt.status, vetComment: apt.vetComment }),
        message: accepted
            ? `Confirmed ${apt.pet_name}'s visit on ${formatLongDay(apt.date)} at ${formatTime(apt.date)}`
            : `Cancelled ${apt.pet_name}'s request`,
    })

    return (
        <EntityManagerPage
            title="Appointments"
            subtitle="Requests from the website, and every booked visit"
            noun="appointment"
            nameOf={(a) => `${a.pet_name}'s appointment`}
            manager={manager}
            columns={COLUMNS}
            fields={formFields(serviceOptions)}
            rows={manager.rows.filter((a) => a.status !== "pending")}
        >
            <PendingBlock count={pending.length} empty="No pending appointments.">
                {pending.map((a) => (
                    <PendingCard key={a.id} when={`Sent ${formatDate(a.createdAt)}`} acceptLabel="Accept" onDecide={(ok) => decide(a, ok)}>
                        <dl className="facts">
                            <Fact label="Pet name">{a.pet_name} <span className="muted">· {a.species}</span></Fact>
                            <Fact label="Owner">{a.name}</Fact>
                            <Fact label="Phone"><a href={`tel:${a.phone}`}>{localPhone(a.phone)}</a></Fact>
                            <Fact label="Email" wide>{a.email ? <a href={`mailto:${a.email}`}>{a.email}</a> : "—"}</Fact>
                            <Fact label="Date">{formatLongDay(a.date)}</Fact>
                            <Fact label="Time">{formatTime(a.date)}</Fact>
                        </dl>
                        <ul className="tag-list" aria-label="Services">
                            {a.services.map((link) => <li key={link.serviceId}>{link.service.title}</li>)}
                        </ul>
                        {a.message && <div className="message"><span>Message</span><p>{a.message}</p></div>}
                        <label className="note">
                            <span>Vet Comment <span className="optional">optional</span></span>
                            <input
                                type="text"
                                maxLength={2000}
                                placeholder="e.g. Bring the vaccination card"
                                value={noteFor(a)}
                                onChange={(e) => setNotes((current) => ({ ...current, [a.id]: e.target.value }))}
                            />
                        </label>
                    </PendingCard>
                ))}
            </PendingBlock>
        </EntityManagerPage>
    )
}

export default AppointmentsManager
