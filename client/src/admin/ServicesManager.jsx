import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { services } from "../api/resources"
import { nextOrder } from "./formRules"

const COLUMNS = [
    { label: "Service name", key: "title" },
    { label: "Description", key: "short_desc", truncate: true },
    { label: "Price", render: (s) => (s.price ? `৳${s.price}` : "—") },
]

const FORM_FIELDS = [
    { name: "title",       label: "Service Name",      required: true, max: 200 },
    { name: "short_desc",  label: "Short Description", type: "textarea", rows: 2, required: true, max: 1000 },
    { name: "description", label: "Description",       type: "textarea", rows: 5, required: true },
    { name: "price",       label: "Price (৳)",         type: "number", min: 0, half: true, hint: "0 hides the price." },
    { name: "order",       label: "Order",             type: "number", min: 1, required: true, half: true, hint: "Position on the website." },
    { name: "img_url",     label: "Image URL",         type: "image", required: true, max: 2000, placeholder: "https://drive.google.com/file/d/…" },
    { name: "features",    label: "Features",          type: "textarea", rows: 3, hint: "Separate items with a semicolon (;)." },
    { name: "icon_key",    label: "Icon",              type: "icons", required: true },
]

const emptyForm = (rows) => ({
    title: "", short_desc: "", description: "", price: 0, img_url: "",
    features: "", icon_key: "checkup", order: nextOrder(rows),
})

const toForm = (service) => ({
    title:       service.title,
    short_desc:  service.short_desc,
    description: service.description,
    price:       service.price,
    img_url:     service.img_url,
    features:    service.features.join("; "),
    icon_key:    service.icon_key,
    order:       service.order,
})

const toPayload = (form) => ({
    ...form,
    price: form.price || 0,
    features: form.features.split(";").map((f) => f.trim()).filter(Boolean),
})

const ServicesManager = () => {
    const manager = useEntityManager({ resource: services, label: "Service", emptyForm, toForm, toPayload })

    return (
        <EntityManagerPage
            title="Services"
            subtitle="Manage the services listed on the website"
            noun="service"
            nameOf={(s) => s.title}
            deleteNote="Appointments booked for it lose it from their list."
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
            rows={[...manager.rows].sort((a, b) => a.order - b.order)}
        />
    )
}

export default ServicesManager
