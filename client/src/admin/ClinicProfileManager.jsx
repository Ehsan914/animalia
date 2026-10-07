import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { clinicProfile } from "../api/resources"
import { localPhone } from "../utils/clinicProfile"
import { PHONE, isMapEmbed } from "./formRules"

// The profile is a single record; present it to the manager as a one-row list.
const profileResource = {
    adminList: async () => [await clinicProfile.adminGet()],
    update: (_id, data) => clinicProfile.update(data),
}

const YES_NO = [
    { value: true,  label: "Yes" },
    { value: false, label: "No" },
]

const COLUMNS = [
    { label: "Phone",     render: (p) => localPhone(p.phone) },
    { label: "Emergency", render: (p) => `${localPhone(p.emergencyPhone)}${p.emergency24h ? " · 24/7" : ""}` },
    { label: "WhatsApp",  render: (p) => localPhone(p.whatsappNumber) },
    { label: "Address",   render: (p) => `${p.streetAddress}, ${p.locality}` },
    { label: "Hours",     render: (p) => `${p.opensAt} – ${p.closesAt}` },
]

const FORM_FIELDS = [
    { name: "phone",          label: "General Phone",            type: "tel",   required: true, half: true, placeholder: "+8801…" },
    { name: "email",          label: "Email",                    type: "email", required: true, half: true },
    { name: "emergencyPhone", label: "Emergency Phone",          type: "tel",   required: true, half: true, placeholder: "+8801…" },
    { name: "whatsappNumber", label: "WhatsApp Number",          type: "tel",   required: true, half: true, placeholder: "+8801…" },
    { name: "emergency24h",   label: "Emergency line open 24/7", type: "options", required: true, options: YES_NO },
    { name: "streetAddress",  label: "Street Address",           required: true, max: 200 },
    { name: "locality",       label: "Area & City",              required: true, max: 100, half: true },
    { name: "postalCode",     label: "Postal Code",              required: true, max: 20, half: true },
    { name: "landmark",       label: "Landmark",                 max: 200 },
    { name: "directionsUrl",  label: "Directions Link",          type: "url", required: true },
    { name: "mapEmbedUrl",    label: "Map Embed Link",           type: "url", required: true, hint: "Google Maps → Share → Embed a map → the src address." },
    { name: "opensAt",        label: "Opens At",                 type: "time", required: true, half: true },
    { name: "closesAt",       label: "Closes At",                type: "time", required: true, half: true },
    { name: "facebookUrl",    label: "Facebook Page",            type: "url" },
]

const check = (form) => {
    const errors = {}
    ;["phone", "emergencyPhone", "whatsappNumber"].forEach((key) => {
        if (form[key] && !PHONE.test(form[key])) errors[key] = "Write it with the country code, like +8801533829537."
    })
    ;["directionsUrl", "facebookUrl"].forEach((key) => {
        if (form[key] && !form[key].startsWith("https://")) errors[key] = "Use a link starting with https://"
    })
    if (form.mapEmbedUrl && !isMapEmbed(form.mapEmbedUrl)) errors.mapEmbedUrl = "Use the link from Google Maps → Share → Embed a map."
    if (form.opensAt && form.closesAt && form.closesAt <= form.opensAt) errors.closesAt = "Close after the opening time."
    return errors
}

// eslint-disable-next-line no-unused-vars
const toForm = ({ id, updatedAt, ...profile }) => profile

const ClinicProfileManager = () => {
    const manager = useEntityManager({
        resource: profileResource,
        label: "Clinic profile",
        emptyForm: () => ({}),
        toForm,
    })

    return (
        <EntityManagerPage
            title="Clinic Profile"
            subtitle="Contact details and hours used across the website"
            noun="clinic profile"
            nameOf={() => "the clinic profile"}
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
            check={check}
            canAdd={false}
            canDelete={false}
        />
    )
}

export default ClinicProfileManager
