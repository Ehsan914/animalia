import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import Button from "../components/ui/Button"
import EntityTable from "./EntityTable"
import EntityModal from "./EntityModal"
import useFetch from "../hooks/useFetch"
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from "../api/blogs"
import toast from 'react-hot-toast'
import slugify from "slugify"

const COLUMNS = [
    { key: "titleEn",     label: "TITLE (EN)" },
    { key: "titleBn",     label: "TITLE (BN)" },
    { key: "categoryEn",  label: "CATEGORY" },
    { key: "author",      label: "AUTHOR" },
    { key: "publishedLabel", label: "STATUS" },
]

const FORM_FIELDS = [
    { name: "titleEn",    label: "Title (English)",         type: "text",     required: true,  placeholder: "e.g., How to Care for Your Pet" },
    { name: "titleBn",    label: "Title (Bengali)",         type: "text",     required: true,  placeholder: "e.g., আপনার পোষা প্রাণীর যত্ন" },
    { name: "categoryEn", label: "Category (English)",      type: "text",     required: true,  placeholder: "e.g., Pet Care" },
    { name: "categoryBn", label: "Category (Bengali)",      type: "text",     required: true,  placeholder: "e.g., পোষা প্রাণীর যত্ন" },
    { name: "author",     label: "Author",                  type: "text",     required: true,  placeholder: "e.g., Dr. Sarah Johnson" },
    { name: "slug",       label: "Slug",                    type: "text",     required: true,  placeholder: "e.g., how-to-care-for-your-pet",   generateable: true },
    { name: "contentEn",  label: "Content (English)",       type: "textarea", required: true,  placeholder: "Write blog content in English..." },
    { name: "contentBn",  label: "Content (Bengali)",       type: "textarea", required: true,  placeholder: "বাংলায় ব্লগ কন্টেন্ট লিখুন..." },
    { name: "published",  label: "Published",               type: "checkbox", required: false },
]

const formatBlog = (b) => ({
    ...b,
    publishedLabel: b.published ? "Published" : "Draft",
})

const emptyForm = () =>
    Object.fromEntries(FORM_FIELDS.map((f) => [f.name, f.type === "checkbox" ? false : ""]))

const BlogsManager = () => {
    const [blogs, setBlogs] = useState([])
    const { execute, loading } = useFetch()

    useEffect(() => {
        execute(getAllBlogs).then(data => setBlogs(data.map(formatBlog)))
    }, [execute])

    const [modalState, setModalState] = useState(null)

    const openAdd = () => {
        setModalState({
            mode: "add",
            formData: emptyForm(),
            editingSlug: null,
        })
    }

    const openEdit = (row) => {
        setModalState({
            mode: "edit",
            formData: {
                titleEn:    row.titleEn,
                titleBn:    row.titleBn,
                categoryEn: row.categoryEn,
                categoryBn: row.categoryBn,
                author:     row.author,
                slug:       row.slug,
                contentEn:  row.contentEn,
                contentBn:  row.contentBn,
                published:  row.published,
            },
            editingSlug: row.slug,
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
                const result = await execute(createBlog, data)
                setBlogs((prev) => [...prev, formatBlog(result)])
                toast.success("Blog created successfully")
            } else {
                const result = await execute(updateBlog, modalState.editingSlug, data)
                setBlogs((prev) =>
                    prev.map((b) => b.slug === modalState.editingSlug ? formatBlog(result) : b)
                )
                toast.success("Blog saved successfully")
            }
            closeModal()
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    const handleDelete = async (row) => {
        try {
            await execute(deleteBlog, row.slug)
            setBlogs((prev) => prev.filter((b) => b.slug !== row.slug))
            toast.success("Blog deleted successfully")
        } catch (err) {
            toast.error("Error: " + err)
        }
    }

    const handleGenerateSlug = () => {
        const title = modalState?.formData?.titleEn || ""
        if (!title) return toast.error("Enter an English title first")

        const generated = slugify(title, {
            lower: true,
            strict: true,
            trim: true,
        })

        setModalState((prev) => ({
            ...prev,
            formData: { ...prev.formData, slug: generated },
        }))
    }

    return (
        <div className="px-7.5 pb-20">
            <div className="w-full flex justify-between items-center">
                <div className="space-y-3 py-5">
                    <h1 className="font-pixel-alt text-[30px] font-semibold leading-8">Blogs</h1>
                    <p className="font-sans font-bold text-[16px]">Manage your blog posts</p>
                </div>
                <Button
                    onClick={openAdd}
                    className="font-pixel-alt text-[20px] leading-6 flex items-center gap-1.5 px-4 py-2 shadow-mc-sharp-b"
                >
                    <Plus size={16} color="white" />
                    Add Blog
                </Button>
            </div>

            <EntityTable
                columns={COLUMNS}
                rows={blogs}
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
                    entityLabel="Blog"
                    onGenerateSlug={handleGenerateSlug}
                />
            )}
        </div>
    )
}

export default BlogsManager