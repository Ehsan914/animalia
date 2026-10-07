import slugify from "slugify"

// The id of a vet's section on /vets ("Dr. Md. Easin" → "md-easin"), so the About
// page (and anything else) can link to /vets#<id>.
export const vetAnchor = (vet) =>
    slugify(vet.name.replace(/^dr\.?\s*/i, ""), { lower: true, strict: true })
