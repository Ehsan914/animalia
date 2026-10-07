import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"
import toast from "react-hot-toast"
import Button from "../components/ui/Button"
import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { appointments, services } from "../api/resources"
import {
    APPOINTMENT_STATUS_LABEL, statusOptions, serviceTitles, formatDate, formatTime, toDateTimeInputs,
} from "./records"

const COLUMNS = [
    { key: "pet_name", label: "PET NAME" },
    { key: "name",     label: "OWNER NAME" },
    { key: "services", label: "SERVICES", render: serviceTitles },
    { key: "status",   label: "STATUS",   render: (apt) => APPOINTMENT_STATUS_LABEL[apt.status] },
    { key: "date",     label: "DATE",     render: (apt) => formatDate(apt.date) },
    { key: "time",     label: "TIME",     render: (apt) => formatTime(apt.date) },
]

const formFields = (serviceOptions) => [
    { name: "name",       label: "Owner Name",   type: "text",        required: true,  placeholder: "e.g., John Doe" },
    { name: "phone",      label: "Phone Number", type: "text",        required: true,  placeholder: "e.g., 01700000000" },
    { name: "email",      label: "Email",        type: "email",       required: true,  placeholder: "e.g., owner@example.com" },
    { name: "pet_name",   label: "Pet Name",     type: "text",        required: true,  placeholder: "e.g., Buddy" },
    { name: "species",    label: "Species",      type: "text",        required: true,  placeholder: "e.g., Dog, Cat, Rabbit" },
    { name: "date",       label: "Date",         type: "date",        required: true },
    { name: "time",       label: "Time",         type: "time",        required: true },
    { name: "serviceIds", label: "Services",     type: "multiselect", options: serviceOptions },
    { name: "message",    label: "Message",      type: "textarea",    placeholder: "Any additional notes from the owner..." },
    { name: "status",     label: "Status",       type: "options",     options: statusOptions(APPOINTMENT_STATUS_LABEL) },
    { name: "vetComment", label: "Vet Comment",  type: "textarea",    placeholder: "Veterinarian's notes or comments..." },
]

const emptyForm = () => ({
    name: "", phone: "", email: "", pet_name: "", species: "", date: "", time: "",
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

const AppointmentsManager = () => {
    const manager = useEntityManager({ resource: appointments, label: "Appointment", emptyForm, toForm, toPayload })
    const [serviceOptions, setServiceOptions] = useState([])
    // Vet comments typed on pending cards, by appointment id, until confirmed.
    const [draftComments, setDraftComments] = useState({})

    useEffect(() => {
        services.adminList()
            .then((list) => setServiceOptions(list.map((s) => ({ value: s.id, label: s.title, price: s.price }))))
            .catch((err) => toast.error(`Could not load services: ${err.message}`))
    }, [])

    const pendingAppointments = manager.rows.filter((a) => a.status === "pending")
    const commentFor = (apt) => draftComments[apt.id] ?? apt.vetComment

    const decide = async (apt, status) => {
        try {
            manager.replaceRow(await appointments.setStatus(apt.id, { status, vetComment: commentFor(apt) }))
            toast.success(status === "approved" ? "Appointment confirmed" : "Appointment cancelled")
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <EntityManagerPage
            title="Appointments"
            subtitle="Manage clinic appointments"
            entityLabel="Appointment"
            manager={manager}
            columns={COLUMNS}
            fields={formFields(serviceOptions)}
            rows={manager.rows.filter((a) => a.status !== "pending")}
        >
            {/* Pending Approvals */}
            <div className="w-full mt-12 flex flex-col gap-6.25">
                <div>
                    <h2 className="font-pixel-alt font-semibold text-2xl">
                        Pending Approvals ({pendingAppointments.length})
                    </h2>
                </div>

                {pendingAppointments.length === 0 ? (
                    <p className="font-sans text-black/50 text-sm">
                        No pending appointments.
                    </p>
                ) : (
                    pendingAppointments.map((apt) => (
                        <div
                            key={apt.id}
                            className="flex flex-col border-mc-primary border-2 shadow-mc-sharp-b px-7.5 py-6.25 gap-6.25"
                        >
                            {/* Top row — identity, contact, date/time, services, badge */}
                            <div className="flex justify-between flex-wrap gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <h1 className="font-sans font-semibold">Pet Name: {apt.pet_name}</h1>
                                    <h1 className="font-sans font-semibold">Owner Name: {apt.name}</h1>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h1 className="font-sans font-semibold">Phone No.: {apt.phone}</h1>
                                    <h1 className="font-sans font-semibold">Email: {apt.email}</h1>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h1 className="font-sans font-semibold">Date: {formatDate(apt.date)}</h1>
                                    <h1 className="font-sans font-semibold">Time: {formatTime(apt.date)}</h1>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h1 className="font-sans font-semibold">
                                        Services: {serviceTitles(apt)}
                                    </h1>
                                </div>
                                <div>
                                    <span className="flex items-center font-pixel-alt text-[20px] text-mc-heart px-3 py-2 bg-red-200 border shadow-mc-flat-b">
                                        Pending
                                    </span>
                                </div>
                            </div>

                            {/* Message */}
                            {apt.message && (
                                <div className="flex flex-col gap-2">
                                    <span className="font-sans font-black">Message:</span>
                                    <div className="border-mc-primary border-2 px-4 py-4">
                                        <p className="font-sans">{apt.message}</p>
                                    </div>
                                </div>
                            )}

                            {/* Vet Comment */}
                            <div className="flex flex-col gap-2">
                                <span className="font-sans font-black">Vet Comment:</span>
                                <input
                                    type="text"
                                    value={commentFor(apt)}
                                    onChange={(e) => setDraftComments((current) => ({ ...current, [apt.id]: e.target.value }))}
                                    placeholder="Vet comment goes here..."
                                    className="border-mc-primary border-2 px-4 py-4 font-sans text-sm outline-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-6.5">
                                <Button
                                    onClick={() => decide(apt, "approved")}
                                    className="flex items-center gap-1.5 font-pixel-alt text-[16px] text-white px-3 py-1.5 border-2 border-mc-primary bg-mc-grass hover:bg-mc-grass/80 hover:text-white transition-colors shadow-mc-flat-b cursor-pointer"
                                >
                                    <Check size={16} />
                                    Accept
                                </Button>
                                <Button
                                    onClick={() => decide(apt, "rejected")}
                                    className="flex items-center gap-1.5 font-pixel-alt text-[16px] text-white px-3 py-1.5 border-2 border-red-700 bg-red-600 hover:bg-red-600/80 hover:text-white hover:border-red-600 transition-colors shadow-mc-flat-b cursor-pointer"
                                >
                                    <X size={16} />
                                    Reject
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </EntityManagerPage>
    )
}

export default AppointmentsManager
