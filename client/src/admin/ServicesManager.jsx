import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import { getServices, createService, updateService, deleteService } from '../api/services'
import useFetch from '../hooks/useFetch'
import toast from 'react-hot-toast'

const COLUMNS = [
    { key: "title",        label: "SERVICE NAME" },
    { key: "description",  label: "DESCRIPTION",  truncate: true },
    { key: "price",        label: "PRICE" },
]

const FORM_FIELDS = [
    { name: "title",       label: "Service Name",                 type: "text",        required: true,  placeholder: "e.g., Vaccination Service" },
    { name: "short_desc", label:  "Short Description",            type: "textarea",    required: true,  placeholder: "Enter service short description..." },
    { name: "description", label: "Description",                  type: "textarea",    required: true,  placeholder: "Enter service description..." },
    { name: "price",       label: "Price",                        type: "number",      required: false, placeholder: "e.g., 500" },
    { name: "img_url",     label: "Image URL",                    type: "url",         required: true,  placeholder: "https://example.com/image.jpg" },
    { name: "features",    label: "Features (comma-separated)",   type: "textarea",    required: false, placeholder: "e.g., Feature 1, Feature 2" },
    { name: "icon_key",    label: "Icon",                         type: "icon-picker", required: true  },
    { name: "order",       label: "Order",                        type: "number",      required: true,  placeholder: "e.g., 1" },
]

// Build an empty formData object from the fields config
const emptyForm = (fields) =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))

const ServicesManager = () => {
    const [services, setServices] = useState([])
    const { execute, loading } = useFetch();

    // Fetch on mount
    useEffect(() => {
        execute(getServices).then(data => setServices(data));
    }, [execute])

    const [modalState, setModalState] = useState(null)
    // modalState: null | { mode: "add" | "edit", formData: {}, editingId: number | null }

    const openAdd = () => {
        const nextOrder = services.length + 1
        setModalState({
            mode: "add",
            formData: { ...emptyForm(FORM_FIELDS), order: nextOrder },
            editingId: null,
        })
    }

    const openEdit = (row) => {
        setModalState({
            mode: "edit",
            formData: {
                title:       row.title,
                short_desc:  row.short_desc ?? "",
                description: row.description,
                price:       row.price,
                img_url:     row.img_url ?? "",
                features:    Array.isArray(row.features) ? row.features.join(", ") : (row.features ?? ""),
                icon_key:    row.icon_key ?? "stethoscope",
                order:       row.order ?? "",
            },
            editingId: row.id,
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
            const payload = {
                ...data,
                price: data.price === "" || data.price === null || data.price === undefined
                    ? 0
                    : Number(data.price),
                features: typeof data.features === "string"
                    ? data.features.split(",").map((f) => f.trim()).filter(Boolean)
                    : data.features ?? [],
            }
            if (modalState.mode === 'add') {
                const result = await execute(createService, payload)
                setServices((prev) => [...prev, result])
                toast.success('Service added successfully')
            } else {
                const result = await execute(updateService, modalState.editingId, payload)
                setServices((prev) =>
                    prev.map((s) => s.id === modalState.editingId ? result : s)
                )
                toast.success('Service saved successfully')
            }

            closeModal()
        } catch (err) {
            toast.error('Error: ' + err)
        }
    }

    const handleDelete = async (row) => {
        try {
            await execute(deleteService, row.id)
            setServices((prev) => prev.filter((s) => s.id !== row.id))
            toast.success('Service deleted successfully')
        } catch (err) {
            toast.error('Error: ' + err)
        }
    }

    return (
        <div className="px-7.5 pb-20">
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">Services</h1>
                    <p className="font-sans font-bold text-[16px]">Manage your available services</p>
                </div>
                <Button
                    onClick={openAdd}
                    className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                >
                    <Plus size={16} color="white" />
                    Add Service
                </Button>
            </div>

            <EntityTable
                columns={COLUMNS}
                rows={services}
                loading={loading}
                onEdit={openEdit}
                onDelete={handleDelete}
            />

            {modalState && (
                <EntityModal
                    fields={FORM_FIELDS}
                    formData={modalState.formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    mode={modalState.mode}
                    entityLabel="Service"
                />
            )}
        </div>
    )
}

export default ServicesManager