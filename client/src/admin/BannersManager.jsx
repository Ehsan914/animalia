import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import Chip from "./Chip"
import { banners } from "../api/resources"

const TYPES = { info: "Info", promo: "Promo", emergency: "Emergency" }
const TYPE_OPTIONS = Object.entries(TYPES).map(([value, label]) => ({ value, label, danger: value === "emergency" }))
const LIVE_OPTIONS = [
    { value: true,  label: "Live" },
    { value: false, label: "Hidden" },
]

const COLUMNS = [
    { label: "Message", key: "message", truncate: true },
    { label: "Type",    render: (b) => <Chip tone={b.type === "emergency" ? "urgent" : "info"}>{TYPES[b.type] ?? b.type}</Chip> },
    { label: "Status",  render: (b) => (b.active ? <Chip tone="live">Live</Chip> : <Chip tone="off">Hidden</Chip>) },
]

const FORM_FIELDS = [
    { name: "message",  label: "Message",      required: true, max: 500 },
    { name: "type",     label: "Type",         type: "options", required: true, options: TYPE_OPTIONS },
    { name: "ctaLabel", label: "Button Label", max: 100, half: true },
    { name: "ctaUrl",   label: "Button Link",  type: "url", links: "button", max: 2000, half: true, placeholder: "/services or https://…" },
    { name: "active",   label: "Show on site", type: "options", required: true, options: LIVE_OPTIONS, hint: "Making this one live hides the others." },
]

const check = (form) => ({
    ...(form.ctaLabel && !form.ctaUrl ? { ctaUrl: "Add where the button goes." } : {}),
    ...(form.ctaUrl && !form.ctaLabel ? { ctaLabel: "Add the button text." } : {}),
})

const emptyForm = () => ({ message: "", type: "promo", ctaLabel: "", ctaUrl: "", active: false })

const toForm = ({ message, type, ctaLabel, ctaUrl, active }) => ({ message, type, ctaLabel, ctaUrl, active })

const BannersManager = () => {
    // Saving a live banner hides the previous one on the server, so refetch.
    const manager = useEntityManager({ resource: banners, label: "Banner", emptyForm, toForm, reloadAfterSave: true })

    return (
        <EntityManagerPage
            title="Banners"
            subtitle="The strip above the site header. Only one can be live at a time"
            noun="banner"
            nameOf={() => "this banner"}
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
            check={check}
        />
    )
}

export default BannersManager
