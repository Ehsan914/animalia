import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { vets, specialities } from "../api/resources"

const COLUMNS = [
    { key: "name",         label: "NAME" },
    { key: "designation",  label: "DESIGNATION" },
    { key: "specialities", label: "SPECIALITIES", render: (vet) => vet.specialities.map((s) => s.name).join(", ") || "None" },
    { key: "experience",   label: "EXPERIENCES",  render: (vet) => (vet.experience ? `${vet.experience} ${vet.experience === 1 ? "year" : "years"}` : "—") },
]

const formFields = (specialityField) => [
    { name: "name",        label: "Vet Name",           type: "text",     required: true,  placeholder: "e.g., Dr. Sarah Johnson" },
    { name: "img_url",     label: "Image URL",          type: "url",      required: true,  placeholder: "https://example.com/image.jpg" },
    { name: "degree",      label: "Degree",             type: "text",     required: true,  placeholder: "e.g., DVM, MVSc" },
    { name: "designation", label: "Designation",        type: "text",     required: true,  placeholder: "e.g., Senior Veterinarian" },
    { name: "short_bio",   label: "Short Bio",          type: "textarea", required: true,  placeholder: "Enter vet short bio..." },
    { name: "bio",         label: "Bio",                type: "textarea", required: true,  placeholder: "Enter vet bio..." },
    { name: "fun_fact",    label: "Fun Fact",           type: "textarea", required: false, placeholder: "e.g., Loves helping animals in need" },
    { name: "experience",  label: "Experience (Years)", type: "number",   required: false, placeholder: "e.g., 5" },
    { name: "specialityIds", label: "Specialities",     type: "multiselect-creatable", ...specialityField },
    { name: "order",       label: "Order",              type: "number",   required: true,  placeholder: "e.g., 1" },
]

const emptyForm = (rows) => ({
    name: "", img_url: "", degree: "", designation: "", short_bio: "", bio: "",
    fun_fact: "", experience: "", specialityIds: [], order: rows.length + 1,
})

const toForm = (vet) => ({
    name:          vet.name,
    img_url:       vet.img_url,
    degree:        vet.degree,
    designation:   vet.designation,
    short_bio:     vet.short_bio,
    bio:           vet.bio,
    fun_fact:      vet.fun_fact,
    experience:    vet.experience,
    specialityIds: vet.specialities.map((s) => s.id),
    order:         vet.order,
})

const VetsManager = () => {
    const manager = useEntityManager({ resource: vets, label: "Vet", emptyForm, toForm })
    const [specialityOptions, setSpecialityOptions] = useState([])

    useEffect(() => {
        specialities.list()
            .then((list) => setSpecialityOptions(list.map((s) => ({ value: s.id, label: s.name }))))
            .catch((err) => toast.error(`Could not load specialities: ${err.message}`))
    }, [])

    const addSpeciality = async (name) => {
        try {
            const created = await specialities.create({ name })
            setSpecialityOptions((current) => [...current, { value: created.id, label: created.name }])
        } catch (err) {
            toast.error(err.message)
        }
    }

    const deleteSpeciality = async (id) => {
        try {
            await specialities.remove(id)
            setSpecialityOptions((current) => current.filter((s) => s.value !== id))
        } catch (err) {
            toast.error(err.message)
        }
    }

    const fields = formFields({ options: specialityOptions, onAdd: addSpeciality, onDelete: deleteSpeciality })

    return (
        <EntityManagerPage
            title="Vets"
            subtitle="Manage your veterinary team"
            entityLabel="Vet"
            manager={manager}
            columns={COLUMNS}
            fields={fields}
        />
    )
}

export default VetsManager
