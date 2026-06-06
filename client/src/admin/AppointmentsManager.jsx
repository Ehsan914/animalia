import { useState, useEffect } from "react"
import { Plus, Check, X } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import useFetch from "../hooks/useFetch"
import {
    getAppointments,
    createAppointmentAdmin,
    updateAppointmentStatus,
    updateAppointmentServices,
    deleteAppointment,
} from "../api/appointments"
import { getServices } from "../api/services" // adjust import path if needed
import toast from "react-hot-toast"

// ─── Column definitions ────────────────────────────────────────────────────────

const COLUMNS = [
    { key: "pet_name",       label: "PET NAME" },
    { key: "name",           label: "OWNER NAME" },
    { key: "servicesLabel",  label: "SERVICES",  truncate: true },
    { key: "statusLabel",    label: "STATUS" },
    { key: "dateLabel",      label: "DATE" },
    { key: "timeLabel",      label: "TIME" },
]

// ─── Form fields ───────────────────────────────────────────────────────────────
// serviceIds field uses the new "service-multiselect" type handled in EntityModal

const FORM_FIELDS = [
    { name: "name",       label: "Owner Name",   type: "text",                required: true,  placeholder: "e.g., John Doe" },
    { name: "phone",      label: "Phone Number", type: "text",                required: true,  placeholder: "e.g., 01700000000" },
    { name: "email",      label: "Email",        type: "email",               required: true,  placeholder: "e.g., owner@example.com" },
    { name: "pet_name",   label: "Pet Name",     type: "text",                required: true,  placeholder: "e.g., Buddy" },
    { name: "species",    label: "Species",      type: "text",                required: true,  placeholder: "e.g., Dog, Cat, Rabbit" },
    { name: "date",       label: "Date",         type: "date",                required: true },
    { name: "time",       label: "Time",         type: "time",                required: true },
    { name: "serviceIds", label: "Services",     type: "service-multiselect", required: false },
    { name: "message",    label: "Message",      type: "textarea",            required: false, placeholder: "Any additional notes from the owner..." },
    { name: "status",     label: "Status",       type: "approval",            required: false },
    { name: "vetComment", label: "Vet Comment",  type: "textarea",            required: false, placeholder: "Veterinarian's notes or comments..." },
]


// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Parse a DateTime from the API into a local date/time string pair.
 * Returns { dateStr: "YYYY-MM-DD", timeStr: "HH:MM" }
 */
const splitDateTime = (isoString) => {
    if (!isoString) return { dateStr: "", timeStr: "" }
    const d = new Date(isoString)
    const dateStr = d.toISOString().split("T")[0]
    const timeStr = d.toTimeString().slice(0, 5)
    return { dateStr, timeStr }
}

/**
 * Normalise an appointment coming from the API into the shape the table/form expects.
 * `services` from the API is an array of AppointmentService join records:
 *   [{ appointmentId, serviceId, service: { id, title, price, ... } }]
 */
const formatAppointment = (apt) => {
    const dateObj = apt.date ? new Date(apt.date) : null

    // Flatten service titles from join table or plain array
    const serviceItems = apt.services ?? []
    const serviceTitles = serviceItems
        .map((s) => s.service?.title ?? s.title ?? "")
        .filter(Boolean)

    // Collect service IDs for the form's multiselect
    const serviceIds = serviceItems
        .map((s) => s.serviceId ?? s.service?.id ?? s.id)
        .filter((id) => id != null)

    return {
        ...apt,
        serviceIds,
        servicesLabel: serviceTitles.length > 0 ? serviceTitles.join(", ") : "—",
        statusLabel:
            apt.status === "approved"
                ? "Confirmed"
                : apt.status === "rejected"
                ? "Cancelled"
                : "Pending",
        dateLabel: dateObj
            ? dateObj.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
            : "—",
        timeLabel: dateObj
            ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "—",
    }
}

const emptyForm = () => ({
    name: "",
    phone: "",
    email: "",
    pet_name: "",
    species: "",
    date: "",
    time: "",
    serviceIds: [],
    message: "",
    status: undefined,
    vetComment: "",
})

const AppointmentsManager = () => {
    const [appointments, setAppointments] = useState([])
    const [serviceOptions, setServiceOptions] = useState([])
    const { execute, loading } = useFetch()

    // Data loading

    useEffect(() => {
        let cancelled = false

        const fetchAll = async () => {
            const [apts, svcs] = await Promise.all([
                execute(getAppointments),
                execute(getServices),
            ])
            if (cancelled) return
            if (apts) setAppointments(apts.map(formatAppointment))
            if (svcs) setServiceOptions(svcs.map((s) => ({ value: s.id, label: s.title, price: s.price })))
        }

        fetchAll()
        return () => { cancelled = true }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const refreshAppointments = async () => {
        const data = await execute(getAppointments)
        if (data) setAppointments(data.map(formatAppointment))
    }

    // Modal state

    const [modalState, setModalState] = useState(null)

    const pendingAppointments = appointments.filter((a) => a.status === "pending")

    const openAdd = () =>
        setModalState({ mode: "add", formData: emptyForm(), editingId: null })

    const openEdit = (row) => {
        const { dateStr, timeStr } = splitDateTime(row.date)
        setModalState({
            mode: "edit",
            formData: {
                name:       row.name,
                phone:      row.phone ?? "",
                email:      row.email ?? "",
                pet_name:   row.pet_name,
                species:    row.species,
                date:       dateStr,
                time:       timeStr,
                serviceIds: row.serviceIds ?? [],
                message:    row.message ?? "",
                status:
                    row.status === "approved" ? true
                    : row.status === "rejected" ? false
                    : undefined,
                vetComment: row.vetComment ?? "",
            },
            editingId: row.id,
        })
    }

    const closeModal = () => setModalState(null)

    const handleChange = (name, value) =>
        setModalState((prev) => ({
            ...prev,
            formData: { ...prev.formData, [name]: value },
        }))

    // Submit

    const handleSubmit = async (data) => {
        const { time, serviceIds, status: statusBool, vetComment, ...rest } = data

        const status =
            statusBool === true
                ? "approved"
                : statusBool === false
                ? "rejected"
                : "pending"

        // Combine date + time into a single ISO DateTime string
        const combinedDate =
            rest.date && time
                ? new Date(`${rest.date}T${time}`).toISOString()
                : rest.date

        const payload = {
            ...rest,
            date: combinedDate,
            status,
            serviceIds: serviceIds ?? [],
        }

        try {
            if (modalState.mode === "add") {
                await execute(createAppointmentAdmin, payload)
                toast.success("Appointment created successfully")
            } else {
                // Update status (and other scalar fields via same PUT endpoint)
                await execute(updateAppointmentStatus, modalState.editingId, { status, vetComment: vetComment ?? "" })
                // Update linked services
                await execute(updateAppointmentServices, modalState.editingId, serviceIds ?? [])
                toast.success("Appointment saved successfully")
            }
            await refreshAppointments()
            closeModal()
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    // ── Delete ──────────────────────────────────────────────────────────────────

    const handleDelete = async (row) => {
        try {
            await execute(deleteAppointment, row.id)
            setAppointments((prev) => prev.filter((a) => a.id !== row.id))
            toast.success("Appointment deleted successfully")
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    // Quick approve / reject from pending section

    const handleConfirm = async (apt) => {
        try {
            await execute(updateAppointmentStatus, apt.id, { status: "approved", vetComment: apt.vetComment ?? "" })
            setAppointments((prev) =>
                prev.map((a) =>
                    a.id === apt.id
                        ? { ...a, status: "approved", statusLabel: "Confirmed" }
                        : a
                )
            )
            toast.success("Appointment confirmed")
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    const handleCancel = async (apt) => {
        try {
            await execute(updateAppointmentStatus, apt.id, { status: "rejected", vetComment: apt.vetComment ?? "" })
            setAppointments((prev) =>
                prev.map((a) =>
                    a.id === apt.id
                        ? { ...a, status: "rejected", statusLabel: "Cancelled" }
                        : a
                )
            )
            toast.success("Appointment cancelled")
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    // Render

    return (
        <div className="px-7.5 pb-20">
            {/* Header */}
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">
                        Appointments
                    </h1>
                    <p className="font-sans font-bold text-[16px]">
                        Manage clinic appointments
                    </p>
                </div>
                <Button
                    onClick={openAdd}
                    className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                >
                    <Plus size={16} color="white" />
                    Add Appointment
                </Button>
            </div>

            {/* Table */}
            <EntityTable
                columns={COLUMNS}
                rows={appointments.filter((a) => a.status !== "pending")}
                loading={loading}
                onEdit={openEdit}
                onDelete={handleDelete}
            />

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
                                    <h1 className="font-sans font-semibold">Phone No.: {apt.phone ?? "—"}</h1>
                                    <h1 className="font-sans font-semibold">Email: {apt.email ?? "—"}</h1>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h1 className="font-sans font-semibold">Date: {apt.dateLabel}</h1>
                                    <h1 className="font-sans font-semibold">Time: {apt.timeLabel}</h1>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <h1 className="font-sans font-semibold">
                                        Services: {apt.servicesLabel}
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
                                    value={apt.vetComment ?? ""}
                                    onChange={(e) => {
                                        const updated = e.target.value
                                        setAppointments((prev) =>
                                            prev.map((a) =>
                                                a.id === apt.id ? { ...a, vetComment: updated } : a
                                            )
                                        )
                                    }}
                                    placeholder="Vet comment goes here..."
                                    className="border-mc-primary border-2 px-4 py-4 font-sans text-sm outline-none"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-6.5">
                                <Button
                                    onClick={() => handleConfirm(apt)}
                                    className="flex items-center gap-1.5 font-pixel-alt text-[16px] text-white px-3 py-1.5 border-2 border-mc-primary bg-mc-grass hover:bg-mc-grass/80 hover:text-white transition-colors shadow-mc-flat-b cursor-pointer"
                                >
                                    <Check size={16} />
                                    Accept
                                </Button>
                                <Button
                                    onClick={() => handleCancel(apt)}
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

            {/* Modal */}
            {modalState && (
                <EntityModal
                    fields={FORM_FIELDS}
                    formData={modalState.formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    mode={modalState.mode}
                    entityLabel="Appointment"
                    serviceOptions={serviceOptions}
                />
            )}
        </div>
    )
}

export default AppointmentsManager