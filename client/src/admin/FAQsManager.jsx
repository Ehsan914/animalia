import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import useFetch from "../hooks/useFetch"
import { getAllFAQs, createFAQ, updateFAQ, deleteFAQ } from "../api/misc"
import toast from 'react-hot-toast'

const COLUMNS = [
    { key: "questionEn", label: "QUESTION (EN)" },
    { key: "questionBn", label: "QUESTION (BN)" },
]

const FORM_FIELDS = [
    { name: "questionEn", label: "Question (English)", type: "text",     required: true,  placeholder: "e.g., What services do you offer?" },
    { name: "questionBn", label: "Question (Bengali)", type: "text",     required: true,  placeholder: "e.g., আপনারা কী কী সেবা প্রদান করেন?" },
    { name: "answerEn",   label: "Answer (English)",   type: "textarea", required: true,  placeholder: "Write the answer in English..." },
    { name: "answerBn",   label: "Answer (Bengali)",   type: "textarea", required: true,  placeholder: "বাংলায় উত্তর লিখুন..." },
    { name: "order",      label: "Order",              type: "number",   required: true,  placeholder: "e.g., 1" },
]

const emptyForm = () =>
    Object.fromEntries(FORM_FIELDS.map((f) => [f.name, ""]))

const FAQsManager = () => {
    const [faqs, setFaqs] = useState([])
    const { execute, loading } = useFetch()

    useEffect(() => {
        execute(getAllFAQs).then(data => setFaqs(data))
    }, [execute])

    const [modalState, setModalState] = useState(null)

    const openAdd = () => {
        const nextOrder = faqs.length + 1
        setModalState({
            mode: "add",
            formData: { ...emptyForm(), order: nextOrder },
            editingId: null,
        })
    }

    const openEdit = (row) => {
        setModalState({
            mode: "edit",
            formData: {
                questionEn: row.questionEn,
                questionBn: row.questionBn,
                answerEn:   row.answerEn,
                answerBn:   row.answerBn,
                order:      row.order,
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
            if (modalState.mode === "add") {
                const result = await execute(createFAQ, data)
                setFaqs((prev) => [...prev, result])
                toast.success("FAQ created successfully")
            } else {
                const result = await execute(updateFAQ, modalState.editingId, data)
                setFaqs((prev) =>
                    prev.map((f) => f.id === modalState.editingId ? result : f)
                )
                toast.success("FAQ saved successfully")
            }
            closeModal()
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    const handleDelete = async (row) => {
        try {
            await execute(deleteFAQ, row.id)
            setFaqs((prev) => prev.filter((f) => f.id !== row.id))
            toast.success("FAQ deleted successfully")
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    return (
        <div className="px-7.5 pb-20">
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">FAQs</h1>
                    <p className="font-sans font-bold text-[16px]">Manage frequently asked questions</p>
                </div>
                <Button
                    onClick={openAdd}
                    className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                >
                    <Plus size={16} color="white" />
                    Add FAQ
                </Button>
            </div>

            <EntityTable
                columns={COLUMNS}
                rows={faqs}
                loading={loading}
                onEdit={openEdit}
                onDelete={handleDelete}
            />

            {modalState && (
                <EntityModal
                    fields={FORM_FIELDS}
                    formData={modalState.formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    mode={modalState.mode}
                    entityLabel="FAQ"
                />
            )}
        </div>
    )
}

export default FAQsManager