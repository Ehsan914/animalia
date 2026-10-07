import { useEffect, useState } from "react"
import slugify from "slugify"
import useEntityManager from "./useEntityManager"
import EntityManagerPage from "./EntityManagerPage"
import Chip from "./Chip"
import { blogs, vets } from "../api/resources"
import toast from "./feedback"
import { SLUG } from "./formRules"

const COLUMNS = [
    { label: "Title (EN)", key: "titleEn" },
    { label: "Title (BN)", render: (blog) => <span lang="bn">{blog.titleBn}</span> },
    { label: "Category",   key: "categoryEn" },
    { label: "Author",     key: "author" },
    { label: "Status",     render: (blog) => (blog.published ? <Chip tone="live">Published</Chip> : <Chip tone="off">Draft</Chip>) },
]

// Matches the public article parser (components/pages/blogText.js).
const BODY_HINT = "Each line is a paragraph. “## ” starts a heading, “- ” a list line."
const PUBLISH = [{ value: true, label: "Publish" }, { value: false, label: "Unpublish" }]

const formFields = (authors) => [
    { name: "titleEn",    label: "Title (English)",    required: true, max: 300 },
    { name: "titleBn",    label: "Title (Bengali)",    required: true, max: 300, bn: true },
    { name: "categoryEn", label: "Category (English)", required: true, max: 100, half: true },
    { name: "categoryBn", label: "Category (Bengali)", required: true, max: 100, half: true, bn: true },
    { name: "author",     label: "Author",             type: "options", required: true, options: authors },
    {
        name: "slug", label: "Slug", type: "slug", required: true, max: 120,
        hint: "The post's web address. Generate makes one from the English title.",
        generate: (form) => slugify(form.titleEn || "", { lower: true, strict: true, trim: true }),
    },
    { name: "contentEn",  label: "Content (English)",  type: "textarea", rows: 10, required: true, hint: BODY_HINT },
    { name: "contentBn",  label: "Content (Bengali)",  type: "textarea", rows: 10, required: true, bn: true },
    { name: "published",  label: "Published",          type: "options", required: true, options: PUBLISH, hint: "Unpublished posts stay off the website." },
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
    const [authors, setAuthors] = useState([])

    // Posts are written by the clinic's vets.
    useEffect(() => {
        vets.list()
            .then((list) => setAuthors(list.map((v) => ({ value: v.name, label: v.name }))))
            .catch((err) => toast.error(`Could not load vets: ${err.message}`))
    }, [])

    const checkSlug = (form, modal) => {
        if (!form.slug) return {}
        if (!SLUG.test(form.slug)) return { slug: "Use lowercase letters, numbers and dashes." }
        if (form.slug === "admin") return { slug: "“admin” is taken by the site. Choose another address." }
        if (manager.rows.some((blog) => blog.slug === form.slug && blog.slug !== modal.key)) {
            return { slug: "Another post already uses this address." }
        }
        return {}
    }

    return (
        <EntityManagerPage
            title="Blogs"
            subtitle="Manage the pet care posts in English and Bangla"
            noun="blog"
            nameOf={(blog) => `“${blog.titleEn}”`}
            manager={manager}
            columns={COLUMNS}
            fields={formFields(authors)}
            keyOf={(blog) => blog.slug}
            check={checkSlug}
        />
    )
}

export default BlogsManager
