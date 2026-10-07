import { useEffect, useState } from "react"
import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { vets, specialities } from "../api/resources"
import toast, { confirm } from "./feedback"
import { nextOrder } from "./formRules"

const COLUMNS = [
    { label: "Name",         key: "name" },
    { label: "Designation",  key: "designation" },
    { label: "Specialities", render: (vet) => vet.specialities.map((s) => s.name).join(", ") || "—" },
    { label: "Experience",   render: (vet) => (vet.experience ? `${vet.experience} year${vet.experience > 1 ? "s" : ""}` : "—") },
]

const formFields = (specialityField) => [
    { name: "name",          label: "Vet Name",           required: true, max: 200 },
    { name: "img_url",       label: "Image URL",          type: "image", required: true, max: 2000, placeholder: "https://drive.google.com/file/d/…" },
    { name: "degree",        label: "Degree",             required: true, max: 200, half: true },
    { name: "designation",   label: "Designation",        required: true, max: 200, half: true },
    { name: "short_bio",     label: "Short Bio",          type: "textarea", rows: 2, required: true, max: 1000 },
    { name: "bio",           label: "Bio",                type: "textarea", rows: 6, required: true },
    { name: "fun_fact",      label: "Fun Fact",           type: "textarea", rows: 2, max: 1000, hint: "Shown as “Beyond the clinic”." },
    { name: "experience",    label: "Experience (Years)", type: "number", min: 0, half: true, hint: "Shown on their profile." },
    { name: "order",         label: "Order",              type: "number", min: 1, required: true, half: true, hint: "Position on the website." },
    { name: "specialityIds", label: "Specialities",       type: "checks", addPlaceholder: "New speciality", ...specialityField },
]

const emptyForm = (rows) => ({
    name: "", img_url: "", degree: "", designation: "", short_bio: "", bio: "",
    fun_fact: "", experience: 0, specialityIds: [], order: nextOrder(rows),
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

const toPayload = (form) => ({ ...form, experience: form.experience || 0 })

const VetsManager = () => {
    const manager = useEntityManager({ resource: vets, label: "Vet", emptyForm, toForm, toPayload })
    const [specialityOptions, setSpecialityOptions] = useState([])

    useEffect(() => {
        specialities.list()
            .then((list) => setSpecialityOptions(list.map((s) => ({ value: s.id, label: s.name }))))
            .catch((err) => toast.error(`Could not load specialities: ${err.message}`))
    }, [])

    // Resolves true when added, so the field can clear what was typed.
    const addSpeciality = async (name) => {
        try {
            const created = await specialities.create({ name })
            setSpecialityOptions((current) => [...current, { value: created.id, label: created.name }])
            return true
        } catch (err) {
            toast.error(err.message)
            return false
        }
    }

    const deleteSpeciality = async (option) => {
        const ok = await confirm({
            title: `Remove ${option.label}?`,
            text: "It comes off the list and off every vet who has it.",
            ok: "Remove",
        })
        if (!ok) return
        try {
            await specialities.remove(option.value)
            setSpecialityOptions((current) => current.filter((s) => s.value !== option.value))
            manager.rows
                .filter((vet) => vet.specialities.some((s) => s.id === option.value))
                .forEach((vet) => manager.replaceRow({ ...vet, specialities: vet.specialities.filter((s) => s.id !== option.value) }))
            if (manager.modal) {
                manager.changeField("specialityIds", manager.modal.form.specialityIds.filter((id) => id !== option.value))
            }
        } catch (err) {
            toast.error(err.message)
        }
    }

    const fields = formFields({ options: specialityOptions, onAdd: addSpeciality, onDelete: deleteSpeciality })

    return (
        <EntityManagerPage
            title="Vets"
            subtitle="Manage the vet profiles on the website"
            noun="vet"
            nameOf={(v) => v.name}
            deleteNote="Their reviews stay."
            manager={manager}
            columns={COLUMNS}
            fields={fields}
            rows={[...manager.rows].sort((a, b) => a.order - b.order)}
        />
    )
}

export default VetsManager
