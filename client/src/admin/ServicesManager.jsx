import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { services } from "../api/resources"

const COLUMNS = [
    { key: "title",        label: "SERVICE NAME" },
    { key: "description",  label: "DESCRIPTION",  truncate: true },
    { key: "price",        label: "PRICE" },
]

const FORM_FIELDS = [
    { name: "title",       label: "Service Name",                   type: "text",        required: true,  placeholder: "e.g., Vaccination Service" },
    { name: "short_desc",  label: "Short Description",              type: "textarea",    required: true,  placeholder: "Enter service short description..." },
    { name: "description", label: "Description",                    type: "textarea",    required: true,  placeholder: "Enter service description..." },
    { name: "price",       label: "Price",                          type: "number",      required: false, placeholder: "e.g., 500" },
    { name: "img_url",     label: "Image URL",                      type: "url",         required: true,  placeholder: "https://example.com/image.jpg" },
    { name: "features",    label: "Features (semicolon-separated)", type: "textarea",    required: false, placeholder: "e.g., Rabies vaccine; Health certificate" },
    { name: "icon_key",    label: "Icon",                           type: "icon-picker", required: true  },
    { name: "order",       label: "Order",                          type: "number",      required: true,  placeholder: "e.g., 1" },
]

const emptyForm = (rows) => ({
    title: "", short_desc: "", description: "", price: "", img_url: "",
    features: "", icon_key: "", order: rows.length + 1,
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
    features: form.features.split(";").map((f) => f.trim()).filter(Boolean),
})

const ServicesManager = () => {
    const manager = useEntityManager({ resource: services, label: "Service", emptyForm, toForm, toPayload })

    return (
        <EntityManagerPage
            title="Services"
            subtitle="Manage your available services"
            entityLabel="Service"
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
        />
    )
}

export default ServicesManager
