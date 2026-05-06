import { useState, useEffect } from "react"
import { Plus, Check, X } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import useFetch from "../hooks/useFetch"
import { getAllReviews, createReviewAdmin, updateReview, deleteReview } from "../api/misc"
import toast from "react-hot-toast"
import { PixelHeart } from "../components/icons/pixel-icons"

const COLUMNS = [
    { key: "author",         label: "NAME" },
    { key: "ratingLabel",    label: "RATING", render: (row) => <StarRating rating={row.rating} />  },
    { key: "text",           label: "COMMENT" },
    { key: "statusLabel",    label: "STATUS" },
    { key: "visibilityLabel", label: "VISIBILITY" },
]

const FORM_FIELDS = [
    { name: "author",    label: "Reviewer Name",  type: "text",     required: true,  placeholder: "e.g., John Doe" },
    { name: "rating",    label: "Rating (1-5)",   type: "rating",   required: true,  placeholder: "1 to 5" },
    { name: "text",      label: "Comment",        type: "textarea", required: true,  placeholder: "Write the review comment..." },
    { name: "status",    label: "Status",         type: "approval", required: false },
    { name: "published", label: "Visibility",     type: "checkbox", required: false, disabledWhen: (formData) => formData.status === false, },
]

// Published toggle labels are repurposed: "Publish" = Visible, "Unpublish" = Hidden

const formatReview = (r) => ({
    ...r,
    ratingLabel:    `${r.rating}/5`,
    statusLabel:    r.status === "approved" ? "Approved" : r.status === "rejected" ? "Rejected" : "Pending",
    visibilityLabel: r.published ? "Visible" : "Hidden",
})

const emptyForm = () => ({ author: "", rating: "", text: "", published: false, status: true })

const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
            <PixelHeart key={i} className={`w-4 h-4 ${i <= rating ? "text-mc-heart" : "text-gray-300"}`} />
        ))}
    </div>
)

const ReviewsManager = () => {
    const [reviews, setReviews] = useState([])
    const { execute, loading } = useFetch()

    useEffect(() => {
        execute(getAllReviews).then((data) => setReviews(data.map(formatReview)))
    }, [execute])

    const [modalState, setModalState] = useState(null)

    const pendingReviews = reviews.filter((r) => r.status === "pending")

    const openAdd = () => setModalState({ mode: "add", formData: emptyForm(), editingId: null })

    const openEdit = (row) =>
        setModalState({
            mode: "edit",
            formData: { 
                author: row.author, 
                rating: row.rating, 
                text: row.text,
                status: row.status === "approved" ? true : row.status === "rejected" ? false : undefined,
                published: row.published,
            },
            editingId: row.id,
        })

    const closeModal = () => setModalState(null)

    const handleChange = (name, value) =>
        setModalState((prev) => ({ ...prev, formData: { ...prev.formData, [name]: value } }))

    const handleSubmit = async (data) => {
        const status = data.status === true
        ? "approved"
        : data.status === false
        ? "rejected"
        : "pending"

        const payload = {
            ...data,
            rating: Math.min(5, Math.max(1, Number(data.rating))),
            status,
            // Only approved reviews can be published
            published: status === "approved" ? data.published : false,
        }

        try {
            if (modalState.mode === "add") {
                const result = await execute(createReviewAdmin, payload)
                setReviews((prev) => [...prev, formatReview(result)])
                toast.success("Review created successfully")
            } else {
                const result = await execute(updateReview, modalState.editingId, payload)
                setReviews((prev) => prev.map((r) => r.id === modalState.editingId ? formatReview(result) : r))
                toast.success("Review saved successfully")
            }
            closeModal()
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    const handleDelete = async (row) => {
        try {
            await execute(deleteReview, row.id)
            setReviews((prev) => prev.filter((r) => r.id !== row.id))
            toast.success("Review deleted successfully")
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    const handleApprove = async (review) => {
        try {
            const result = await execute(updateReview, review.id, { status: "approved" })
            setReviews((prev) => prev.map((r) => r.id === review.id ? formatReview(result) : r))
            toast.success("Review approved")
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    const handleReject = async (review) => {
        try {
            const result = await execute(updateReview, review.id, { status: "rejected" })
            setReviews((prev) => prev.map((r) => r.id === review.id ? formatReview(result) : r))
            toast.success("Review rejected")
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    return (
        <div className="px-7.5 pb-20">
            {/* Header */}
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">Reviews</h1>
                    <p className="font-sans font-bold text-[16px]">Manage clinic reviews</p>
                </div>
                <Button
                    onClick={openAdd}
                    className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                >
                    <Plus size={16} color="white" />
                    Add Review
                </Button>
            </div>

            {/* Table */}
            <EntityTable
                columns={COLUMNS}
                rows={reviews.filter((r) => r.status !== "pending")}
                loading={loading}
                onEdit={openEdit}
                onDelete={handleDelete}
            />

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
                                    <span className="font-sans font-semibold flex items-center gap-2">Rating: <StarRating rating={review.rating} /></span>
                                </div>
                                <span className="font-pixel-alt text-[20px] text-mc-heart px-3 py-2 bg-red-200 border shadow-mc-flat-b">
                                    Pending
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                    <span className="font-sans font-black">Message:</span>
                                    <div className="border-mc-primary border-2 px-4 py-4 font-sans text-sm outline-none">
                                        <p className="font-sans">{review.text}</p>
                                    </div>
                            </div>
                            <div className="flex gap-6.5">
                                <Button
                                    onClick={() => handleApprove(review)}
                                    className="flex items-center gap-1.5 font-pixel-alt text-[16px] text-white px-3 py-1.5 border-2 border-mc-primary bg-mc-grass hover:bg-mc-grass/80 hover:text-white transition-colors shadow-mc-flat-b cursor-pointer"
                                >
                                    <Check size={16} />
                                    Accept
                                </Button>
                                <Button
                                    onClick={() => handleReject(review)}
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

            {/* Modal */}
            {modalState && (
                <EntityModal
                    fields={FORM_FIELDS}
                    formData={modalState.formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={closeModal}
                    mode={modalState.mode}
                    entityLabel="Review"
                />
            )}
        </div>
    )
}

export default ReviewsManager