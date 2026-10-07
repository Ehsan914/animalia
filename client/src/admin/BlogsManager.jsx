import slugify from "slugify"
import toast from "react-hot-toast"
import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import { blogs } from "../api/resources"

const COLUMNS = [
    { key: "titleEn",     label: "TITLE (EN)" },
    { key: "titleBn",     label: "TITLE (BN)" },
    { key: "categoryEn",  label: "CATEGORY" },
    { key: "author",      label: "AUTHOR" },
    { key: "published",   label: "STATUS", render: (blog) => (blog.published ? "Published" : "Draft") },
]

const slugFromTitle = (form) => {
    if (!form.titleEn) {
        toast.error("Enter an English title first")
        return undefined
    }
    return slugify(form.titleEn, { lower: true, strict: true, trim: true })
}

const FORM_FIELDS = [
    { name: "titleEn",    label: "Title (English)",    type: "text",     required: true,  placeholder: "e.g., How to Care for Your Pet" },
    { name: "titleBn",    label: "Title (Bengali)",    type: "text",     required: true,  placeholder: "e.g., আপনার পোষা প্রাণীর যত্ন" },
    { name: "categoryEn", label: "Category (English)", type: "text",     required: true,  placeholder: "e.g., Pet Care" },
    { name: "categoryBn", label: "Category (Bengali)", type: "text",     required: true,  placeholder: "e.g., পোষা প্রাণীর যত্ন" },
    { name: "author",     label: "Author",             type: "text",     required: true,  placeholder: "e.g., Dr. Sarah Johnson" },
    { name: "slug",       label: "Slug",               type: "slug",     required: true,  placeholder: "e.g., how-to-care-for-your-pet", generate: slugFromTitle },
    { name: "contentEn",  label: "Content (English)",  type: "textarea", required: true,  placeholder: "Write blog content in English..." },
    { name: "contentBn",  label: "Content (Bengali)",  type: "textarea", required: true,  placeholder: "বাংলায় ব্লগ কন্টেন্ট লিখুন..." },
    { name: "published",  label: "Published",          type: "publish",  required: false },
]

const emptyForm = () => ({
    titleEn: "", titleBn: "", categoryEn: "", categoryBn: "", author: "",
    slug: "", contentEn: "", contentBn: "", published: false,
})

const toForm = ({ titleEn, titleBn, categoryEn, categoryBn, author, slug, contentEn, contentBn, published }) =>
    ({ titleEn, titleBn, categoryEn, categoryBn, author, slug, contentEn, contentBn, published })

const BlogsManager = () => {
    const manager = useEntityManager({
        resource: blogs,
        label: "Blog",
        emptyForm,
        toForm,
        keyOf: (blog) => blog.slug,
    })

    return (
        <EntityManagerPage
            title="Blogs"
            subtitle="Manage your blog posts"
            entityLabel="Blog"
            manager={manager}
            columns={COLUMNS}
            fields={FORM_FIELDS}
        />
    )
}

export default BlogsManager
