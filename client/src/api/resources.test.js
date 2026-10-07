import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("./axiosInstance", () => ({ default: { request: vi.fn() } }))

const { default: axiosInstance } = await import("./axiosInstance")
const { ApiError, createResource, reviews, appointments, clinicProfile } = await import("./resources")

beforeEach(() => { axiosInstance.request.mockReset() })

describe("resource client", () => {
    it("returns the response body", async () => {
        axiosInstance.request.mockResolvedValue({ data: [{ id: 1 }] })

        await expect(createResource("/services").list()).resolves.toEqual([{ id: 1 }])
        expect(axiosInstance.request).toHaveBeenCalledWith({ method: "get", url: "/services", params: undefined, data: undefined })
    })

    it("turns a server rejection into an ApiError with the server's message", async () => {
        axiosInstance.request.mockRejectedValue({ response: { status: 409, data: { message: "A record with that value already exists" } } })

        const error = await createResource("/specialities").create({ name: "Surgery" }).catch((err) => err)

        expect(error).toBeInstanceOf(ApiError)
        expect(error).toMatchObject({ message: "A record with that value already exists", status: 409 })
    })

    it("explains a network failure", async () => {
        axiosInstance.request.mockRejectedValue(new Error("Network Error"))

        const error = await createResource("/vets").adminList().catch((err) => err)

        expect(error.message).toBe("Could not reach the server. Please try again.")
        expect(error.status).toBeUndefined()
    })

    it.each([
        ["update", () => createResource("/blogs").update("puppy-care", { a: 1 }), "put", "/blogs/puppy-care"],
        ["remove", () => createResource("/faqs").remove(3), "delete", "/faqs/3"],
        ["legacy slug", () => createResource("/blogs").remove("old post/1"), "delete", "/blogs/old%20post%2F1"],
        ["adminList", () => createResource("/faqs").adminList(), "get", "/faqs/admin"],
        ["moderated create", () => reviews.create({ a: 1 }), "post", "/reviews/admin"],
        ["public submit", () => appointments.submit({ a: 1 }), "post", "/appointment"],
        ["status change", () => appointments.setStatus(7, { status: "approved" }), "patch", "/appointment/7/status"],
        ["profile update", () => clinicProfile.update({ a: 1 }), "put", "/clinic-profile"],
    ])("sends %s to the right endpoint", async (_name, call, method, url) => {
        axiosInstance.request.mockResolvedValue({ data: {} })
        await call()
        expect(axiosInstance.request).toHaveBeenCalledWith(expect.objectContaining({ method, url }))
    })
})
