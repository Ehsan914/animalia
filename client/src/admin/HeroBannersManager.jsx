import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { heroBanners } from "../api/resources"

// The server anchors calendar days to the clinic's timezone, so read them back
// in that timezone; slicing the UTC string would show the start a day early.
const CLINIC_TIME_ZONE = "Asia/Dhaka"
const clinicDay = (iso) => new Date(iso).toLocaleDateString("en-CA", { timeZone: CLINIC_TIME_ZONE })
const displayDay = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: CLINIC_TIME_ZONE })

const LIVE_OPTIONS = [
    { value: true,  label: "Live" },
    { value: false, label: "Hidden" },
]

const COLUMNS = [
    { key: "title",  label: "TITLE", truncate: true },
    { key: "dates",  label: "DATE RANGE", render: (row) => `${displayDay(row.startDate)} – ${displayDay(row.endDate)}` },
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
    { name: "active",       label: "Show on site",                type: "options", options: LIVE_OPTIONS },
]

const emptyForm = () => ({
    title: "", description: "", location: "", mapUrl: "", imageUrl: "", partnerLogos: "",
    startDate: "", endDate: "", startTime: "", endTime: "", active: true,
})

const toForm = (banner) => ({
    title:        banner.title,
    description:  banner.description,
    location:     banner.location,
    mapUrl:       banner.mapUrl,
    imageUrl:     banner.imageUrl,
    // One link per line in the textarea; the server splits it again.
    partnerLogos: banner.partnerLogos.join("\n"),
    startDate:    clinicDay(banner.startDate),
    endDate:      clinicDay(banner.endDate),
    startTime:    banner.startTime,
    endTime:      banner.endTime,
    active:       banner.active,
})

const HeroBannersManager = () => {
    // Saving a live banner hides the previous one on the server, so refetch.
    const manager = useEntityManager({ resource: heroBanners, label: "Hero banner", emptyForm, toForm, reloadAfterSave: true })

    return (
        <EntityManagerPage
            title="Hero Banners"
            subtitle="Promo slides shown in the homepage hero (one live at a time, shown until its end date)"
            entityLabel="Hero Banner"
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
        />
    )
}

export default HeroBannersManager
