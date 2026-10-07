import { Check, X } from "lucide-react"
import toast from "react-hot-toast"
import Button from "../components/ui/Button"
import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import StarRating from "./StarRating"
import { reviews } from "../api/resources"
import { REVIEW_STATUS_LABEL, statusOptions } from "./records"

const COLUMNS = [
    { key: "author",    label: "NAME" },
    { key: "rating",    label: "RATING",     render: (review) => <StarRating rating={review.rating} /> },
    { key: "text",      label: "COMMENT" },
    { key: "status",    label: "STATUS",     render: (review) => REVIEW_STATUS_LABEL[review.status] },
    { key: "published", label: "VISIBILITY", render: (review) => (review.published ? "Visible" : "Hidden") },
]

const FORM_FIELDS = [
    { name: "author",    label: "Reviewer Name", type: "text",     required: true, placeholder: "e.g., John Doe" },
    { name: "pet_name",  label: "Pet Name",      type: "text",     required: true, placeholder: "e.g., Milo" },
    { name: "species",   label: "Species",       type: "text",     required: true, placeholder: "e.g., Cat" },
    { name: "rating",    label: "Rating (1-5)",  type: "rating",   required: true },
    { name: "text",      label: "Comment",       type: "textarea", required: true, placeholder: "Write the review comment..." },
    { name: "status",    label: "Status",        type: "options",  options: statusOptions(REVIEW_STATUS_LABEL) },
    {
        name: "published",
        label: "Visibility",
        type: "publish",
        // The server enforces this too; the hint just explains the greyed-out toggle.
        disabledWhen: (form) => form.status !== "approved",
        disabledHint: "Only approved reviews can be published.",
    },
]

const emptyForm = () => ({ author: "", pet_name: "", species: "", rating: 5, text: "", status: "approved", published: false })

const toForm = ({ author, pet_name, species, rating, text, status, published }) =>
    ({ author, pet_name, species, rating, text, status, published })

const ReviewsManager = () => {
    const manager = useEntityManager({ resource: reviews, label: "Review", emptyForm, toForm })
    const pendingReviews = manager.rows.filter((r) => r.status === "pending")

    const moderate = async (review, status) => {
        try {
            manager.replaceRow(await reviews.setStatus(review.id, { status }))
            toast.success(status === "approved" ? "Review approved" : "Review rejected")
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <EntityManagerPage
            title="Reviews"
            subtitle="Manage clinic reviews"
            entityLabel="Review"
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
            rows={manager.rows.filter((r) => r.status !== "pending")}
        >
            {/* Pending Approvals */}
            <div className="w-full mt-12 flex flex-col gap-6.25">
                <div>
                    <h2 className="font-pixel-alt font-semibold text-2xl">
                        Pending Approvals ({pendingReviews.length})
                    </h2>
                </div>

                {pendingReviews.length === 0 ? (
                    <p className="font-sans text-black/50 text-sm">No pending reviews.</p>
                ) : (
                    pendingReviews.map((review) => (
                        <div
                            key={review.id}
                            className="flex flex-col border-mc-primary border-2 shadow-mc-sharp-b px-7.5 py-6.25 gap-6.25"
                        >
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-1.5">
                                    <h1 className="font-sans font-semibold">Reviewer: {review.author}</h1>
                                    <h1 className="font-sans font-semibold">Pet Name: {review.pet_name}</h1>
                                    <h1 className="font-sans font-semibold">Species: {review.species}</h1>
                                    <span className="font-sans font-semibold flex items-center gap-2">Rating: <StarRating rating={review.rating} /></span>
                                </div>
                                <div>
                                    <span className="flex font-pixel-alt text-[20px] text-mc-heart px-3 py-2 bg-red-200 border shadow-mc-flat-b">
                                        Pending
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                    <span className="font-sans font-black">Message:</span>
                                    <div className="border-mc-primary border-2 px-4 py-4 font-sans text-sm outline-none">
                                        <p className="font-sans">{review.text}</p>
                                    </div>
                            </div>
                            <div className="flex gap-6.5">
                                <Button
                                    onClick={() => moderate(review, "approved")}
                                    className="flex items-center gap-1.5 font-pixel-alt text-[16px] text-white px-3 py-1.5 border-2 border-mc-primary bg-mc-grass hover:bg-mc-grass/80 hover:text-white transition-colors shadow-mc-flat-b cursor-pointer"
                                >
                                    <Check size={16} />
                                    Accept
                                </Button>
                                <Button
                                    onClick={() => moderate(review, "rejected")}
                                    className="flex items-center gap-1.5 font-pixel-alt text-[16px] text-white px-3 py-1.5 border-2 border-red-700 bg-red-600 hover:bg-red-600/80 hover:text-white hover:border-red-600 transition-colors shadow-mc-flat-b cursor-pointer"
                                >
                                    <X size={16} />
                                    Reject
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </EntityManagerPage>
    )
}

export default ReviewsManager
