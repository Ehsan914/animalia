import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { faqs } from "../api/resources"
import { nextOrder } from "./formRules"

const COLUMNS = [
    { label: "Question (EN)", key: "questionEn" },
    {
        label: "Question (BN)",
        render: (faq) => (faq.questionBn
            ? <span lang="bn">{faq.questionBn}</span>
            : <span className="muted">Not written yet</span>),
    },
]

const FORM_FIELDS = [
    { name: "questionEn", label: "Question (English)", required: true, max: 500 },
    { name: "questionBn", label: "Question (Bengali)", required: true, max: 500, bn: true },
    { name: "answerEn",   label: "Answer (English)",   type: "textarea", rows: 4, required: true },
    { name: "answerBn",   label: "Answer (Bengali)",   type: "textarea", rows: 4, required: true, bn: true },
    { name: "order",      label: "Order",              type: "number", min: 1, required: true, half: true, hint: "Position on the website." },
]

const emptyForm = (rows) => ({ questionEn: "", questionBn: "", answerEn: "", answerBn: "", order: nextOrder(rows) })

const toForm = ({ questionEn, questionBn, answerEn, answerBn, order }) =>
    ({ questionEn, questionBn, answerEn, answerBn, order })

const FAQsManager = () => {
    const manager = useEntityManager({ resource: faqs, label: "FAQ", emptyForm, toForm })

    return (
        <EntityManagerPage
            title="FAQs"
            subtitle="Manage the common questions on the services page"
            noun="FAQ"
            nameOf={() => "this question"}
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
            rows={[...manager.rows].sort((a, b) => a.order - b.order)}
        />
    )
}

export default FAQsManager
