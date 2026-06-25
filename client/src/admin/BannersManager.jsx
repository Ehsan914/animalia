import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import useFetch from "../hooks/useFetch"
import { getAllBanners, createBanner, updateBanner, deleteBanner } from "../api/banners"
import toast from 'react-hot-toast'

const TYPE_LABELS = { info: "Info", promo: "Promo", emergency: "Emergency" }

const COLUMNS = [
    { key: "message", label: "MESSAGE", truncate: true },
    { key: "type", label: "TYPE", render: (row) => TYPE_LABELS[row.type] ?? row.type },
    { key: "active", label: "STATUS", align: "center", render: (row) => (row.active ? "● Live" : "Hidden") },
]

const FORM_FIELDS = [
    { name: "message",  label: "Message",                 type: "text", required: true, placeholder: "e.g., Free Rabies Vaccination · 7–13 June" },
    { name: "type",     label: "Type",                    type: "options", options: [
        { value: "info",      label: "Info" },
        { value: "promo",     label: "Promo" },
        { value: "emergency", label: "Emergency" },
    ]},
    { name: "ctaLabel", label: "Button Label (optional)", type: "text", placeholder: "e.g., Learn more" },
    { name: "ctaUrl",   label: "Button Link (optional)",  type: "text", placeholder: "e.g., /services or https://..." },
    { name: "active",   label: "Show on site",            type: "options", options: [
        { value: true,  label: "Live" },
        { value: false, label: "Hidden" },
    ]},
]

const emptyForm = () => ({ message: "", type: "promo", ctaLabel: "", ctaUrl: "", active: true })

const BannersManager = () => {
    const [banners, setBanners] = useState([])
    const { execute, loading } = useFetch()

    const reload = () => execute(getAllBanners).then(setBanners)

    useEffect(() => {
        execute(getAllBanners).then(setBanners)
    }, [execute])

    const [modalState, setModalState] = useState(null)

    const openAdd = () => setModalState({ mode: "add", formData: emptyForm(), editingId: null })

    const openEdit = (row) => setModalState({
        mode: "edit",
        formData: {
            message:  row.message,
            type:     row.type,
            ctaLabel: row.ctaLabel,
            ctaUrl:   row.ctaUrl,
            active:   row.active,
        },
        editingId: row.id,
    })

    const closeModal = () => setModalState(null)

    const handleChange = (name, value) => {
        setModalState((prev) => ({ ...prev, formData: { ...prev.formData, [name]: value } }))
    }

    const handleSubmit = async (data) => {
        try {
            if (modalState.mode === "add") {
                await execute(createBanner, data)
                toast.success("Banner created")
            } else {
                await execute(updateBanner, modalState.editingId, data)
                toast.success("Banner saved")
            }
            // Refetch so the single-live-banner rule (enforced server-side) is reflected.
            await reload()
            closeModal()
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    const handleDelete = async (row) => {
        try {
            await execute(deleteBanner, row.id)
            setBanners((prev) => prev.filter((b) => b.id !== row.id))
            toast.success("Banner deleted")
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    return (
        <div className="px-7.5 pb-20">
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">Banners</h1>
                    <p className="font-sans font-bold text-[16px]">Manage the site-wide announcement bar (one is live at a time)</p>
                </div>
                <Button
                    onClick={openAdd}
                    className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                >
                    <Plus size={16} color="white" />
                    Add Banner
                </Button>
            </div>

            <EntityTable
                columns={COLUMNS}
                rows={banners}
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
                    entityLabel="Banner"
                />
            )}
        </div>
    )
}

export default BannersManager
