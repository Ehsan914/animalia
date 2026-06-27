import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import useFetch from "../hooks/useFetch"
import { getAllHeroBanners, createHeroBanner, updateHeroBanner, deleteHeroBanner } from "../api/heroBanners"
import toast from 'react-hot-toast'

const fmt = (value) =>
    value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : ""

const COLUMNS = [
    { key: "title", label: "TITLE", truncate: true },
    { key: "dates", label: "DATE RANGE", render: (row) => `${fmt(row.startDate)} – ${fmt(row.endDate)}` },
    { key: "active", label: "STATUS", align: "center", render: (row) => (row.active ? "● Live" : "Hidden") },
]

const FORM_FIELDS = [
    { name: "title",        label: "Title",                       type: "text",     required: true, placeholder: "e.g., Free Vaccination Campaign" },
    { name: "description",  label: "Description",                 type: "textarea", required: true, placeholder: "Short 2–3 line description of the campaign." },
    { name: "location",     label: "Location",                    type: "text",     placeholder: "e.g., Animalia Vet Care, Mirpur, Dhaka" },
    { name: "mapUrl",       label: "Map Link (optional)",         type: "url",      placeholder: "e.g., https://maps.google.com/?q=..." },
    { name: "imageUrl",     label: "Photo (Google Drive share link)", type: "url",  required: true, placeholder: "https://drive.google.com/file/d/FILE_ID/view?usp=sharing" },
    { name: "partnerLogos", label: "Partner Logos (one Google Drive link per line)", type: "textarea", placeholder: "https://drive.google.com/file/d/FILE_ID_1/view\nhttps://drive.google.com/file/d/FILE_ID_2/view" },
    { name: "startDate",    label: "Start Date",                  type: "date",     required: true },
    { name: "endDate",      label: "End Date",                    type: "date",     required: true },
    { name: "startTime",    label: "Start Time (optional)",       type: "time" },
    { name: "endTime",      label: "End Time (optional)",         type: "time" },
    { name: "active",       label: "Show on site",                type: "options", options: [
        { value: true,  label: "Live" },
        { value: false, label: "Hidden" },
    ]},
]

const emptyForm = () => ({ title: "", description: "", location: "", mapUrl: "", imageUrl: "", partnerLogos: "", startDate: "", endDate: "", startTime: "", endTime: "", active: true })

const HeroBannersManager = () => {
    const [banners, setBanners] = useState([])
    const { execute, loading } = useFetch()

    const reload = () => execute(getAllHeroBanners).then(setBanners)

    useEffect(() => {
        execute(getAllHeroBanners).then(setBanners)
    }, [execute])

    const [modalState, setModalState] = useState(null)

    const openAdd = () => setModalState({ mode: "add", formData: emptyForm(), editingId: null })

    const openEdit = (row) => setModalState({
        mode: "edit",
        formData: {
            title:        row.title,
            description:  row.description,
            location:     row.location ?? "",
            mapUrl:       row.mapUrl ?? "",
            imageUrl:     row.imageUrl,
            // Array → newline-separated text for the textarea; server re-parses it.
            partnerLogos: (row.partnerLogos ?? []).join("\n"),
            // ISO datetime → YYYY-MM-DD for the native date input.
            startDate:    row.startDate ? row.startDate.slice(0, 10) : "",
            endDate:      row.endDate ? row.endDate.slice(0, 10) : "",
            startTime:    row.startTime ?? "",
            endTime:      row.endTime ?? "",
            active:       row.active,
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
                await execute(createHeroBanner, data)
                toast.success("Hero banner created")
            } else {
                await execute(updateHeroBanner, modalState.editingId, data)
                toast.success("Hero banner saved")
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
            await execute(deleteHeroBanner, row.id)
            setBanners((prev) => prev.filter((b) => b.id !== row.id))
            toast.success("Hero banner deleted")
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    return (
        <div className="px-7.5 pb-20">
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">Hero Banners</h1>
                    <p className="font-sans font-bold text-[16px]">Promo slides shown in the homepage hero (one live at a time, auto-shown within its date range)</p>
                </div>
                <Button
                    onClick={openAdd}
                    className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                >
                    <Plus size={16} color="white" />
                    Add Hero Banner
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
                    entityLabel="Hero Banner"
                />
            )}
        </div>
    )
}

export default HeroBannersManager
