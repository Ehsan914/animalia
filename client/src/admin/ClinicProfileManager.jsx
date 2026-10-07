import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { clinicProfile } from "../api/resources"
import { formatPhone, openingHours, shortAddress } from "../utils/clinicProfile"

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
    { key: "phone",          label: "PHONE",     render: (p) => formatPhone(p.phone) },
    { key: "emergencyPhone", label: "EMERGENCY", render: (p) => formatPhone(p.emergencyPhone) },
    { key: "whatsappNumber", label: "WHATSAPP",  render: (p) => formatPhone(p.whatsappNumber) },
    { key: "address",        label: "ADDRESS",   render: shortAddress },
    { key: "hours",          label: "HOURS",     render: openingHours },
]

const PHONE_HINT = "International format, e.g. +8801533829537"

const FORM_FIELDS = [
    { name: "phone",          label: "General Phone",              type: "tel",     required: true, placeholder: PHONE_HINT },
    { name: "email",          label: "Email",                      type: "email",   required: true, placeholder: "e.g., animaliavetcare25@gmail.com" },
    { name: "emergencyPhone", label: "Emergency Phone",            type: "tel",     required: true, placeholder: PHONE_HINT },
    { name: "emergency24h",   label: "Emergency line open 24/7",   type: "options", options: YES_NO },
    { name: "whatsappNumber", label: "WhatsApp Number",            type: "tel",     required: true, placeholder: PHONE_HINT },
    { name: "streetAddress",  label: "Street Address",             type: "text",    required: true, placeholder: "e.g., Ekushey Vobon, 677 West Shewrapara" },
    { name: "locality",       label: "Area & City",                type: "text",    required: true, placeholder: "e.g., Mirpur, Dhaka" },
    { name: "postalCode",     label: "Postal Code",                type: "text",    required: true, placeholder: "e.g., 1216" },
    { name: "landmark",       label: "Landmark (optional)",        type: "text",    placeholder: "e.g., Beside Shewrapara Metro Station" },
    { name: "directionsUrl",  label: "Directions Link",            type: "url",     required: true, placeholder: "e.g., https://maps.app.goo.gl/..." },
    { name: "mapEmbedUrl",    label: "Map Embed Link (Google Maps → Share → Embed a map → the src address)", type: "url", required: true, placeholder: "https://www.google.com/maps/embed?pb=..." },
    { name: "opensAt",        label: "Opens At",                   type: "time",    required: true },
    { name: "closesAt",       label: "Closes At",                  type: "time",    required: true },
    { name: "facebookUrl",    label: "Facebook Page (optional)",   type: "url",     placeholder: "https://www.facebook.com/..." },
]

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
            subtitle="Phone numbers, address and opening hours shown across the website"
            entityLabel="Clinic Profile"
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
            canAdd={false}
            canDelete={false}
        />
    )
}

export default ClinicProfileManager
