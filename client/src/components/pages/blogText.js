// Blog posts as the public API returns them: one language's fields per request
// (titleEn/contentEn/categoryEn, or the Bn set). Bodies are plain text from the
// admin textarea, rendered as text — never as HTML.

const WORDS_PER_MINUTE = 200
const EXCERPT_LENGTH = 200

const HEADING = /^#{1,6}\s+(.*)$/
const LIST_ITEM = /^[-*•]\s+(.*)$/

// Plain text → blocks. Each non-empty line is a paragraph; a line starting "#"
// is a heading; consecutive "-", "*" or "•" lines form one list.
export const parseBlocks = (text = "") =>
    (text ?? "")
        .replace(/\r\n?/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .reduce((blocks, line) => {
            const heading = HEADING.exec(line)
            if (heading) return [...blocks, { type: "h2", text: heading[1] }]
            const item = LIST_ITEM.exec(line)
            if (!item) return [...blocks, { type: "p", text: line }]
            const last = blocks.at(-1)
            if (last?.type === "ul") return [...blocks.slice(0, -1), { type: "ul", items: [...last.items, item[1]] }]
            return [...blocks, { type: "ul", items: [item[1]] }]
        }, [])

// The first paragraph, cut at a word boundary.
export const excerpt = (text, max = EXCERPT_LENGTH) => {
    const first = parseBlocks(text).find((block) => block.type === "p")?.text ?? ""
    if (first.length <= max) return first
    const cut = first.slice(0, max)
    const lastSpace = cut.lastIndexOf(" ")
    return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–—-]+$/, "")}…`
}

export const readMinutes = (text = "") =>
    Math.max(1, Math.round(text.trim().split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE))

export const postFields = (post, lang) =>
    lang === "bn"
        ? { title: post.titleBn, content: post.contentBn, category: post.categoryBn }
        : { title: post.titleEn, content: post.contentEn, category: post.categoryEn }

export const postHref = (post, lang) => `/blogs/${post.slug}${lang === "bn" ? "?lang=bn" : ""}`

export const postDate = (createdAt, lang) =>
    new Date(createdAt).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Dhaka",
    })

export const readLabel = (text, lang) => {
    const minutes = readMinutes(text)
    return lang === "bn" ? `${minutes.toLocaleString("bn-BD")} মিনিট` : `${minutes} min read`
}
