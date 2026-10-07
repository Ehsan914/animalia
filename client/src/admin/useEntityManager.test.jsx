// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, renderHook, waitFor } from "@testing-library/react"

vi.mock("./feedback", () => ({ UNDO_MS: 5000, default: { show: vi.fn(), error: vi.fn(), dismiss: vi.fn() } }))

const { default: toast } = await import("./feedback")
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
afterEach(() => { vi.useRealTimers() })

// The Undo callback offered with the last toast.
const lastUndo = () => toast.show.mock.calls.at(-1)[1].undo

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
        expect(toast.show).toHaveBeenCalledWith("Blog added")
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

    it("keeps a record whose delete is waiting hidden when a save refetches the list", async () => {
        const resource = fakeResource([{ id: 1, slug: "a" }, { id: 2, slug: "b" }])
        const { result } = await loaded(resource, { reloadAfterSave: true })

        act(() => result.current.remove(result.current.rows[0]))
        act(() => result.current.openEdit(result.current.rows[0]))
        await act(() => result.current.submit({ slug: "b", title: "B" }))

        expect(resource.adminList).toHaveBeenCalledTimes(2)
        expect(result.current.rows.map((r) => r.slug)).toEqual(["b"])
    })

    it("hides a deleted record at once and deletes it on the server when Undo runs out", async () => {
        const resource = fakeResource([{ id: 1, slug: "a" }, { id: 2, slug: "b" }])
        const { result } = await loaded(resource)
        vi.useFakeTimers()

        act(() => result.current.remove(result.current.rows[0]))

        expect(result.current.rows.map((r) => r.slug)).toEqual(["b"])
        expect(resource.remove).not.toHaveBeenCalled()
        expect(toast.show).toHaveBeenCalledWith("Blog deleted", expect.objectContaining({ undo: expect.any(Function) }))

        act(() => vi.advanceTimersByTime(5000))

        expect(resource.remove).toHaveBeenCalledWith("a")
    })

    it("puts a deleted record back in its place on Undo and never deletes it", async () => {
        const resource = fakeResource([{ id: 1, slug: "a" }, { id: 2, slug: "b" }, { id: 3, slug: "c" }])
        const { result } = await loaded(resource)
        vi.useFakeTimers()

        act(() => result.current.remove(result.current.rows[1]))
        act(() => lastUndo()())
        act(() => vi.advanceTimersByTime(5000))

        expect(result.current.rows.map((r) => r.slug)).toEqual(["a", "b", "c"])
        expect(resource.remove).not.toHaveBeenCalled()
    })

    it("sends a waiting delete straight away when the page is left", async () => {
        const resource = fakeResource([{ id: 1, slug: "a" }])
        const { result, unmount } = await loaded(resource)

        act(() => result.current.remove(result.current.rows[0]))
        unmount()

        expect(resource.remove).toHaveBeenCalledWith("a")
    })

    it("brings a record back when the server refuses the delete", async () => {
        const resource = { ...fakeResource([{ id: 1, slug: "a" }]), remove: vi.fn().mockRejectedValue(new Error("Server error")) }
        const { result } = await loaded(resource)
        vi.useFakeTimers()

        act(() => result.current.remove(result.current.rows[0]))
        await act(async () => { vi.advanceTimersByTime(5000) })

        expect(result.current.rows.map((r) => r.slug)).toEqual(["a"])
        expect(toast.error).toHaveBeenCalledWith("Could not delete: Server error")
    })

    it("applies a change at once and reverses it on Undo", async () => {
        const { result } = await loaded(fakeResource([{ id: 1, slug: "a", status: "pending" }]))

        await act(() => result.current.changeWithUndo({
            run: async () => ({ id: 1, slug: "a", status: "approved" }),
            undo: async () => ({ id: 1, slug: "a", status: "pending" }),
            message: "Approved",
        }))
        expect(result.current.rows[0].status).toBe("approved")

        await act(() => lastUndo()())
        expect(result.current.rows[0].status).toBe("pending")
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
