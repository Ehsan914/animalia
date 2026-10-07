import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import StarRating from "./StarRating"
import Chip from "./Chip"
import { PendingBlock, PendingCard, Fact } from "./PendingApprovals"
import { useReportPending } from "./pendingCounts"
import { reviews } from "../api/resources"
import { REVIEW_STATUS_LABEL, STATUS_TONE, SPECIES_OPTIONS, statusChoices, formatDate } from "./records"

const COLUMNS = [
    { label: "Name",       key: "author" },
    { label: "Rating",     render: (r) => <StarRating rating={r.rating} /> },
    { label: "Comment",    key: "text", truncate: true },
    { label: "Status",     render: (r) => <Chip tone={STATUS_TONE[r.status]}>{REVIEW_STATUS_LABEL[r.status]}</Chip> },
    { label: "Visibility", render: (r) => (r.published ? <Chip tone="live">Visible</Chip> : <Chip tone="off">Hidden</Chip>) },
]

const PUBLISH = [{ value: true, label: "Publish" }, { value: false, label: "Unpublish" }]

const FORM_FIELDS = [
    { name: "author",    label: "Reviewer Name", required: true, max: 100, half: true },
    { name: "pet_name",  label: "Pet Name",      required: true, max: 100, half: true },
    { name: "species",   label: "Species",       type: "options", required: true, options: SPECIES_OPTIONS },
    { name: "rating",    label: "Rating",        type: "rating", required: true },
    { name: "text",      label: "Comment",       type: "textarea", rows: 5, required: true, max: 1000 },
    { name: "status",    label: "Status",        type: "options", required: true, options: statusChoices(REVIEW_STATUS_LABEL) },
    { name: "published", label: "Visibility",    type: "options", required: true, options: PUBLISH, hint: "Only approved reviews can be shown." },
]

const emptyForm = () => ({ author: "", pet_name: "", species: "Dog", rating: 5, text: "", status: "approved", published: true })

const toForm = ({ author, pet_name, species, rating, text, status, published }) =>
    ({ author, pet_name, species, rating, text, status, published })

// The server enforces this too: only an approved review can be public.
const toPayload = (form) => ({ ...form, published: form.status === "approved" && form.published })

const ReviewsManager = () => {
    const manager = useEntityManager({ resource: reviews, label: "Review", emptyForm, toForm, toPayload })
    useReportPending("reviews", manager.rows, manager.loading)
    const pending = manager.rows.filter((r) => r.status === "pending")

    // Accept publishes in one write; Undo (or Reject) goes through the status change,
    // which takes the review off the site again.
    const decide = (review, accepted) => manager.changeWithUndo({
        run: () => (accepted
            ? reviews.update(review.id, { ...toForm(review), status: "approved", published: true })
            : reviews.setStatus(review.id, { status: "rejected" })),
        undo: () => reviews.setStatus(review.id, { status: review.status }),
        message: `${accepted ? "Published" : "Rejected"} the review from ${review.author}`,
    })

    return (
        <EntityManagerPage
            title="Reviews"
            subtitle="Manage what pet parents say. Only visible reviews appear on the website"
            noun="review"
            nameOf={(r) => `the review from ${r.author}`}
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
            rows={manager.rows.filter((r) => r.status !== "pending")}
        >
            <PendingBlock count={pending.length} empty="No pending reviews.">
                {pending.map((r) => (
                    <PendingCard key={r.id} when={formatDate(r.createdAt)} acceptLabel="Accept & publish" onDecide={(ok) => decide(r, ok)}>
                        <dl className="facts">
                            <Fact label="Reviewer">{r.author}</Fact>
                            <Fact label="Pet name">{r.pet_name || "—"}</Fact>
                            <Fact label="Species">{r.species || "—"}</Fact>
                            <Fact label="Rating"><StarRating rating={r.rating} /></Fact>
                        </dl>
                        <div className="message"><span>Message</span><p>{r.text}</p></div>
                    </PendingCard>
                ))}
            </PendingBlock>
        </EntityManagerPage>
    )
}

export default ReviewsManager
