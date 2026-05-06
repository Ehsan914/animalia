import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import useFetch from "../hooks/useFetch"
import { getContact, updateContact } from "../api/misc"
import toast from 'react-hot-toast'

const COLUMNS = [
    { key: "phone", label: "PHONE" },
    { key: "email", label: "EMAIL" },
]

const FORM_FIELDS = [
    { name: "phone", label: "Phone",  type: "text", required: true, placeholder: "e.g., +880 1700-000000" },
    { name: "email", label: "Email",  type: "text", required: true, placeholder: "e.g., contact@example.com" },
]

const emptyForm = () =>
    Object.fromEntries(FORM_FIELDS.map((f) => [f.name, ""]))

const ContactsManager = () => {
    const [contacts, setContacts] = useState([])
    const { execute, loading } = useFetch()

    useEffect(() => {
        execute(getContact).then(data => {
            // API returns a single object; wrap in array for the table
            if (data && data.id) setContacts([data])
        })
    }, [execute])

    const [modalState, setModalState] = useState(null)

    const hasEntry = contacts.length > 0

    const openEdit = (row) => {
        setModalState({
            mode: "edit",
            formData: {
                phone: row.phone,
                email: row.email,
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
            const result = await execute(updateContact, data)
            setContacts([result])
            toast.success("Contact saved successfully")
            closeModal()
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    return (
        <div className="px-7.5 pb-20">
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">Contact</h1>
                    <p className="font-sans font-bold text-[16px]">Manage contact information</p>
                </div>
                {/* Add button only shown when no entry exists */}
                {!hasEntry && (
                    <Button
                        onClick={() => setModalState({ mode: "add", formData: emptyForm() })}
                        className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                    >
                        <Plus size={16} color="white" />
                        Add Contact
                    </Button>
                )}
            </div>

            <EntityTable
                columns={COLUMNS}
                rows={contacts}
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
                    entityLabel="Contact"
                />
            )}
        </div>
    )
}

export default ContactsManager