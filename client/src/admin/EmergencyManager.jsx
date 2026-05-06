import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import useFetch from "../hooks/useFetch"
import { getEmergencyContact, updateEmergencyContact } from "../api/misc"
import toast from 'react-hot-toast'

const COLUMNS = [
    { key: "phone",            label: "PHONE" },
    { key: "available24hLabel", label: "24H AVAILABILITY" },
]

const FORM_FIELDS = [
    { name: "phone",       label: "Phone",            type: "text",     required: true,  placeholder: "e.g., +880 1700-000000" },
    { name: "available24h", label: "24h Availability", type: "checkbox", required: false },
]

const formatEmergencyContact = (ec) => ({
    ...ec,
    available24hLabel: ec.available24h ? "Available" : "Not Available",
})

const emptyForm = () => ({ phone: "", available24h: false })

const EmergencyContactsManager = () => {
    const [records, setRecords] = useState([])
    const { execute, loading } = useFetch()

    useEffect(() => {
        execute(getEmergencyContact).then(data => {
            if (data && data.id) setRecords([formatEmergencyContact(data)])
        })
    }, [execute])

    const [modalState, setModalState] = useState(null)

    const hasEntry = records.length > 0

    const openEdit = (row) => {
        setModalState({
            mode: "edit",
            formData: {
                phone:       row.phone,
                available24h: row.available24h,
            },
        })
    }

    const closeModal = () => setModalState(null)

    const handleChange = (name, value) => {
        setModalState((prev) => ({
            ...prev,
            formData: { ...prev.formData, [name]: value },
        }))
    }

    const handleSubmit = async (data) => {
        try {
            const result = await execute(updateEmergencyContact, data)
            setRecords([formatEmergencyContact(result)])
            toast.success("Emergency contact saved successfully")
            closeModal()
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    return (
        <div className="px-7.5 pb-20">
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">Emergency Contact</h1>
                    <p className="font-sans font-bold text-[16px]">Manage emergency contact information</p>
                </div>
                {/* Add button only shown when no entry exists */}
                {!hasEntry && (
                    <Button
                        onClick={() => setModalState({ mode: "add", formData: emptyForm() })}
                        className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                    >
                        <Plus size={16} color="white" />
                        Add Emergency Contact
                    </Button>
                )}
            </div>

            <EntityTable
                columns={COLUMNS}
                rows={records}
                loading={loading}
                onEdit={openEdit}
                onDelete={undefined}
            />

            {modalState && (
                <EntityModal
                    fields={FORM_FIELDS}
                    formData={modalState.formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    mode={modalState.mode}
                    entityLabel="Emergency Contact"
                />
            )}
        </div>
    )
}

export default EmergencyContactsManager