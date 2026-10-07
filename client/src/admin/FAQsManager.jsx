import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { faqs } from "../api/resources"

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

const emptyForm = (rows) => ({ questionEn: "", questionBn: "", answerEn: "", answerBn: "", order: rows.length + 1 })

const toForm = ({ questionEn, questionBn, answerEn, answerBn, order }) =>
    ({ questionEn, questionBn, answerEn, answerBn, order })

const FAQsManager = () => {
    const manager = useEntityManager({ resource: faqs, label: "FAQ", emptyForm, toForm })

    return (
        <EntityManagerPage
            title="FAQs"
            subtitle="Manage frequently asked questions"
            entityLabel="FAQ"
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
        />
    )
}

export default FAQsManager
