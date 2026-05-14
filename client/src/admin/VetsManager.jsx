import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import useFetch from "../hooks/useFetch"
import { createVet, getVets, updateVet, deleteVet, getSpecialities, createSpeciality, deleteSpeciality } from "../api/vets"
import toast from 'react-hot-toast'

const COLUMNS = [
    { key: "name",         label: "NAME" },
    { key: "designation",  label: "DESIGNATION" },
    { key: "specialitiesText", label: "SPECIALITIES" },
    { key: "experience",   label: "EXPERIENCES" },
]

const FORM_FIELDS = (onAdd, onDelete) => [
    { name: "name",          label: "Vet Name",                    type: "text",                  required: true,  placeholder: "e.g., Dr. Sarah Johnson" },
    { name: "img_url",       label: "Image URL",                   type: "url",                   required: true,  placeholder: "https://example.com/image.jpg" },
    { name: "degree",        label: "Degree",                      type: "text",                  required: true,  placeholder: "e.g., DVM, MVSc" },
    { name: "designation",   label: "Designation",                 type: "text",                  required: true,  placeholder: "e.g., Senior Veterinarian" },
    { name: "bio",           label: "Bio",                         type: "textarea",              required: true,  placeholder: "Enter vet bio..." },
    { name: "fun_fact",      label: "Fun Fact",                    type: "textarea",              required: false, placeholder: "e.g., Loves helping animals in need" },
    { name: "experience",    label: "Experience (Years)",          type: "number",                required: false, placeholder: "e.g., 5" },
    { 
        name: "specialities", 
        label: "Specialities", 
        type: "multiselect-creatable", 
        required: true, 
        placeholder: "Select one or more specialities",
        onAdd,
        onDelete,
    },
    { name: "order",         label: "Order",                       type: "number",                required: true,  placeholder: "e.g., 1" },
]


const formatVet = (v) => ({
    ...v,
    specialitiesText: v.specialities?.map(s => s.name).join(", ") || "None",
    experience: v.experience ? `${v.experience} ${v.experience == 1 ? "year" : "years"}` : "—"
})

// Build an empty formData object from the fields config
const emptyForm = (fields) =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))

const VetsManager = () => {
    const [vets, setVets] = useState([]);
    const [specialityOptions, setSpecialityOptions] = useState([]);
    const { execute, loading } = useFetch();

    // Fetch on mount
    useEffect(() => {
        execute(getVets).then(data => setVets(data.map(formatVet)));

        execute(getSpecialities).then(data =>
            setSpecialityOptions(data.map(s => ({ value: s.id, label: s.name })))
        );
    }, [execute])

    const [modalState, setModalState] = useState(null)
    // modalState: null | { mode: "add" | "edit", formData: {}, editingId: number | null }

    const openAdd = () => {
        const nextOrder = vets.length + 1
        setModalState({
            mode: "add",
            formData: { ...emptyForm(FORM_FIELDS(handleAddSpeciality, handleDeleteSpeciality)), order: nextOrder, specialityIds: [] },
            editingId: null,
        })
    }

    const openEdit = (row) => {
        setModalState({
            mode: "edit",
            formData: {
                name:           row.name,
                degree:         row.degree,
                designation:    row.designation,
                bio:            row.bio,
                fun_fact:       row.fun_fact,
                img_url:        row.img_url ?? "",
                experience:     typeof row.experience === "string"
                                ? parseInt(row.experience) || ""   // strips " years"
                                : row.experience ?? "",
                order:          row.order ?? "",
                specialities: Array.isArray(row.specialities) ? row.specialities.map(s => s.id) : [],
            },
            editingId: row.id,
        })
    }

    const closeModal = () => setModalState(null)

    const handleChange = (name, value) => {
        setModalState((prev) => ({
            ...prev,
            formData: { ...prev.formData, [name]: value },
        }))
    }

    const handleSubmit = async (data) => {
        try {
            
            const payload = {
                ...data,
                specialityIds: data.specialities ?? [],
                specialities: undefined,
            }

            if (modalState.mode === 'add') {
                const result = await execute(createVet, payload)
                setVets((prev) => [...prev, formatVet(result)])
                toast.success('Vet added successfully')
            } else {
                const result = await execute(updateVet, modalState.editingId, payload)
                setVets((prev) => 
                    prev.map((s) => s.id === modalState.editingId ? formatVet(result) : s)
                )
                toast.success('Vet saved successfully')
            }

            closeModal()
        } catch (err) {
            toast.error('Error: ' + err)
            
        }
    }

    const handleDelete = async (row) => {
        try {
            await execute(deleteVet, row.id)
            setVets((prev) => prev.filter((s) => s.id !== row.id))
            toast.success('Vet deleted successfully')
        } catch (err) {
            toast.error('Error: ' + err)
        }
    }

    const handleAddSpeciality = async (name) => {
        const created = await execute(createSpeciality, name)
        setSpecialityOptions(prev => [...prev, { value: created.id, label: created.name }])
    }

    const handleDeleteSpeciality = async (id) => {
        await execute(deleteSpeciality, id)
        setSpecialityOptions(prev => prev.filter(s => s.value !== id))
    }

    return (
        <div className="px-7.5 pb-20">
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">Vets</h1>
                    <p className="font-sans font-bold text-[16px]">Manage your veterinary team</p>
                </div>
                <Button
                    onClick={openAdd}
                    className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                >
                    <Plus size={16} color="white" />
                    Add Vet
                </Button>
            </div>

            <EntityTable
                columns={COLUMNS}
                rows={vets}
                loading={loading}
                onEdit={openEdit}
                onDelete={handleDelete}
            />

            {modalState && (
                <EntityModal
                    fields={FORM_FIELDS(handleAddSpeciality, handleDeleteSpeciality)}
                    formData={modalState.formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    mode={modalState.mode}
                    entityLabel="Vet"
                    specialityOptions={specialityOptions}
                />
            )}
        </div>
    )
}

export default VetsManager