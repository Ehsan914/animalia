import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { banners } from "../api/resources"

const TYPE_OPTIONS = [
    { value: "info",      label: "Info" },
    { value: "promo",     label: "Promo" },
    { value: "emergency", label: "Emergency" },
]
const LIVE_OPTIONS = [
    { value: true,  label: "Live" },
    { value: false, label: "Hidden" },
]

const COLUMNS = [
    { key: "message", label: "MESSAGE", truncate: true },
    { key: "type",    label: "TYPE",   render: (row) => TYPE_OPTIONS.find((t) => t.value === row.type)?.label ?? row.type },
    { key: "active",  label: "STATUS", align: "center", render: (row) => (row.active ? "● Live" : "Hidden") },
]

const FORM_FIELDS = [
    { name: "message",  label: "Message",                 type: "text", required: true, placeholder: "e.g., Free Rabies Vaccination · 7–13 June" },
    { name: "type",     label: "Type",                    type: "options", options: TYPE_OPTIONS },
    { name: "ctaLabel", label: "Button Label (optional)", type: "text", placeholder: "e.g., Learn more" },
    { name: "ctaUrl",   label: "Button Link (optional)",  type: "text", placeholder: "e.g., /services or https://..." },
    { name: "active",   label: "Show on site",            type: "options", options: LIVE_OPTIONS },
]

const emptyForm = () => ({ message: "", type: "promo", ctaLabel: "", ctaUrl: "", active: true })

const toForm = ({ message, type, ctaLabel, ctaUrl, active }) => ({ message, type, ctaLabel, ctaUrl, active })

const BannersManager = () => {
    // Saving a live banner hides the previous one on the server, so refetch.
    const manager = useEntityManager({ resource: banners, label: "Banner", emptyForm, toForm, reloadAfterSave: true })

    return (
        <EntityManagerPage
            title="Banners"
            subtitle="Manage the site-wide announcement bar (one is live at a time)"
            entityLabel="Banner"
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
        />
    )
}

export default BannersManager
