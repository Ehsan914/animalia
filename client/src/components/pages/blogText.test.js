import { describe, expect, test } from "vitest"
import { parseBlocks, excerpt, readMinutes, postFields, postHref, postDate } from "./blogText"

describe("parseBlocks", () => {
    test("turns each non-empty line into a paragraph", () => {
        expect(parseBlocks("First line.\n\nSecond line.\nThird line.")).toEqual([
            { type: "p", text: "First line." },
            { type: "p", text: "Second line." },
            { type: "p", text: "Third line." },
        ])
    })

    test("reads '#' lines as headings and groups '-' lines into one list", () => {
        expect(parseBlocks("## Signs\n- Panting\n* Red gums\n• Weakness\nCall us.")).toEqual([
            { type: "h2", text: "Signs" },
            { type: "ul", items: ["Panting", "Red gums", "Weakness"] },
            { type: "p", text: "Call us." },
        ])
    })

    test("handles Windows line endings and empty content", () => {
        expect(parseBlocks("One\r\nTwo")).toHaveLength(2)
        expect(parseBlocks("")).toEqual([])
        expect(parseBlocks(undefined)).toEqual([])
    })
})

describe("excerpt", () => {
    test("uses the first paragraph, skipping headings", () => {
        expect(excerpt("## Title\nThe first paragraph.\nThe second.")).toBe("The first paragraph.")
    })

    test("cuts long text at a word boundary", () => {
        const text = "word ".repeat(100).trim()
        const result = excerpt(text, 30)
        expect(result.endsWith("…")).toBe(true)
        expect(result.length).toBeLessThanOrEqual(31)
        expect(result).not.toMatch(/\s…$/)
    })
})

describe("readMinutes", () => {
    test("is at least one minute, at 200 words a minute", () => {
        expect(readMinutes("a few words")).toBe(1)
        expect(readMinutes("word ".repeat(600))).toBe(3)
    })
})

describe("postFields and postHref", () => {
    const en = { slug: "puppy-care", titleEn: "Puppy care", contentEn: "Body", categoryEn: "Care" }
    const bn = { slug: "puppy-care", titleBn: "ছানার যত্ন", contentBn: "লেখা", categoryBn: "যত্ন" }

    test("picks the fields of the requested language", () => {
        expect(postFields(en, "en")).toEqual({ title: "Puppy care", content: "Body", category: "Care" })
        expect(postFields(bn, "bn")).toEqual({ title: "ছানার যত্ন", content: "লেখা", category: "যত্ন" })
    })

    test("links Bangla posts with ?lang=bn", () => {
        expect(postHref(en, "en")).toBe("/blogs/puppy-care")
        expect(postHref(bn, "bn")).toBe("/blogs/puppy-care?lang=bn")
    })
})

describe("postDate", () => {
    test("formats in Dhaka time", () => {
        expect(postDate("2026-09-27T20:00:00.000Z", "en")).toBe("28 Sept 2026")
    })
})
