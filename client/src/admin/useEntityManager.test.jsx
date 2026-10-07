// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"

vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }))

const { default: toast } = await import("react-hot-toast")
const { default: useEntityManager } = await import("./useEntityManager")

// An in-memory adapter for a resource keyed by slug.
const fakeResource = (initial) => {
    let records = [...initial]
    return {
        adminList: vi.fn(async () => [...records]),
        create: vi.fn(async (data) => {
            const record = { ...data, id: records.length + 1 }
            records = [...records, record]
            return record
        }),
        update: vi.fn(async (slug, data) => {
            const record = { ...records.find((r) => r.slug === slug), ...data }
            records = records.map((r) => (r.slug === slug ? record : r))
            return record
        }),
        remove: vi.fn(async (slug) => {
            records = records.filter((r) => r.slug !== slug)
        }),
    }
}

const setup = (resource, options = {}) => renderHook(() => useEntityManager({
    resource,
    label: "Blog",
    emptyForm: (rows) => ({ slug: "", title: "", order: rows.length + 1 }),
    toForm: ({ slug, title }) => ({ slug, title }),
    keyOf: (blog) => blog.slug,
    ...options,
}))

const loaded = async (resource, options) => {
    const hook = setup(resource, options)
    await waitFor(() => expect(hook.result.current.loading).toBe(false))
    return hook
}

beforeEach(() => { vi.clearAllMocks() })

describe("useEntityManager", () => {
    it("loads the admin list", async () => {
        const { result } = await loaded(fakeResource([{ id: 1, slug: "a", title: "A" }]))
        expect(result.current.rows).toEqual([{ id: 1, slug: "a", title: "A" }])
    })

    it("opens an empty form that can depend on the current rows", async () => {
        const { result } = await loaded(fakeResource([{ id: 1, slug: "a", title: "A" }]))

        act(() => result.current.openAdd())

        expect(result.current.modal).toEqual({ mode: "add", form: { slug: "", title: "", order: 2 }, key: null })
    })

    it("adds a record and closes the modal", async () => {
        const resource = fakeResource([])
        const { result } = await loaded(resource)

        act(() => result.current.openAdd())
        act(() => result.current.changeField("title", "New"))
        await act(() => result.current.submit({ slug: "new", title: "New", order: 1 }))

        expect(result.current.rows.map((r) => r.slug)).toEqual(["new"])
        expect(result.current.modal).toBeNull()
        expect(toast.success).toHaveBeenCalledWith("Blog added")
    })

    it("edits by the record's original key, even when the key changes", async () => {
        const resource = fakeResource([{ id: 1, slug: "old", title: "Old" }])
        const { result } = await loaded(resource)

        act(() => result.current.openEdit(result.current.rows[0]))
        await act(() => result.current.submit({ slug: "renamed", title: "Renamed" }))

        expect(resource.update).toHaveBeenCalledWith("old", { slug: "renamed", title: "Renamed" })
        expect(result.current.rows).toEqual([{ id: 1, slug: "renamed", title: "Renamed" }])
    })

    it("keeps the modal open and shows the server's message when saving fails", async () => {
        const resource = { ...fakeResource([]), create: vi.fn().mockRejectedValue(new Error("title: is required")) }
        const { result } = await loaded(resource)

        act(() => result.current.openAdd())
        await act(() => result.current.submit({ slug: "x", title: "" }))

        expect(result.current.modal).not.toBeNull()
        expect(toast.error).toHaveBeenCalledWith("title: is required")
    })

    it("refetches after saving when the server changes other records", async () => {
        const resource = fakeResource([])
        const { result } = await loaded(resource, { reloadAfterSave: true })

        act(() => result.current.openAdd())
        await act(() => result.current.submit({ slug: "x", title: "X" }))

        expect(resource.adminList).toHaveBeenCalledTimes(2)
        expect(result.current.rows.map((r) => r.slug)).toEqual(["x"])
    })

    it("removes a record", async () => {
        const resource = fakeResource([{ id: 1, slug: "a" }, { id: 2, slug: "b" }])
        const { result } = await loaded(resource)

        await act(() => result.current.remove(result.current.rows[0]))

        expect(resource.remove).toHaveBeenCalledWith("a")
        expect(result.current.rows.map((r) => r.slug)).toEqual(["b"])
    })

    it("reports a failed load instead of showing an empty table silently", async () => {
        const resource = { ...fakeResource([]), adminList: vi.fn().mockRejectedValue(new Error("Server error")) }
        const { result } = await loaded(resource)

        expect(result.current.rows).toEqual([])
        expect(toast.error).toHaveBeenCalledWith("Could not load blog list: Server error")
    })

    it("replaces a single row after a status change", async () => {
        const { result } = await loaded(fakeResource([{ id: 1, slug: "a", status: "pending" }]))

        act(() => result.current.replaceRow({ id: 1, slug: "a", status: "approved" }))

        expect(result.current.rows[0].status).toBe("approved")
    })
})
