import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import useFetch from "../hooks/useFetch"
import { getLocation, updateLocation } from "../api/misc"
import toast from 'react-hot-toast'

const COLUMNS = [
    { key: "address", label: "ADDRESS", truncate: true },
    { key: "mapUrl",  label: "MAP URL",  truncate: true },
]

const FORM_FIELDS = [
    { name: "address", label: "Address", type: "text",     required: true, placeholder: "e.g., 123 Main Street, Dhaka" },
    { name: "mapUrl",  label: "Map URL", type: "text",     required: true, placeholder: "e.g., https://maps.google.com/..." },
]

const emptyForm = () =>
    Object.fromEntries(FORM_FIELDS.map((f) => [f.name, ""]))

const LocationsManager = () => {
    const [records, setRecords] = useState([])
    const { execute, loading } = useFetch()

    useEffect(() => {
        execute(getLocation).then(data => {
            if (data && data.id) setRecords([data])
        })
    }, [execute])

    const [modalState, setModalState] = useState(null)

    const hasEntry = records.length > 0

    const openEdit = (row) => {
        setModalState({
            mode: "edit",
            formData: {
                address: row.address,
                mapUrl:  row.mapUrl,
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
            const result = await execute(updateLocation, data)
            setRecords([result])
            toast.success("Location saved successfully")
            closeModal()
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    return (
        <div className="px-7.5 pb-20">
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">Location</h1>
                    <p className="font-sans font-bold text-[16px]">Manage location information</p>
                </div>
                {/* Add button only shown when no entry exists */}
                {!hasEntry && (
                    <Button
                        onClick={() => setModalState({ mode: "add", formData: emptyForm() })}
                        className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                    >
                        <Plus size={16} color="white" />
                        Add Location
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
                    entityLabel="Location"
                />
            )}
        </div>
    )
}

export default LocationsManager