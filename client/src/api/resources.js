import axiosInstance from "./axiosInstance"

// A failed API call, carrying the server's message — safe to show in a toast.
export class ApiError extends Error {
    constructor(message, status) {
        super(message)
        this.name = "ApiError"
        this.status = status
    }
}

const send = async (method, url, { params, data } = {}) => {
    try {
        const response = await axiosInstance.request({ method, url, params, data })
        return response.data
    } catch (err) {
        throw new ApiError(
            err.response?.data?.message ?? "Could not reach the server. Please try again.",
            err.response?.status,
        )
    }
}

/**
 * Admin CRUD for one server resource (server/lib/resourceRouter.js). `key` is
 * whatever the server addresses records by: the id, or a blog's slug.
 */
export const createResource = (path) => ({
    list: (params) => send("get", path, { params }),
    adminList: () => send("get", `${path}/admin`),
    create: (data) => send("post", path, { data }),
    update: (key, data) => send("put", `${path}/${encodeURIComponent(key)}`, { data }),
    remove: (key) => send("delete", `${path}/${encodeURIComponent(key)}`),
})

// Reviews and appointments: public submissions, admin creates, and status
// changes go through the moderation lifecycle (server/lib/moderation.js).
const createModeratedResource = (path) => ({
    ...createResource(path),
    submit: (data) => send("post", path, { data }),
    create: (data) => send("post", `${path}/admin`, { data }),
    setStatus: (id, data) => send("patch", `${path}/${id}/status`, { data }),
})

export const services = createResource("/services")
export const vets = createResource("/vets")
export const specialities = createResource("/specialities")
export const faqs = createResource("/faqs")
export const blogs = createResource("/blogs")
// list() on banners returns the one live banner, or null; on heroBanners, every
// live hero banner (active and not yet ended), earliest start first.
export const banners = createResource("/banners")
export const heroBanners = createResource("/hero-banners")
export const reviews = createModeratedResource("/reviews")
export const appointments = createModeratedResource("/appointment")

export const clinicProfile = {
    get: () => send("get", "/clinic-profile"),
    adminGet: () => send("get", "/clinic-profile/admin"),
    update: (data) => send("put", "/clinic-profile", { data }),
}

export const login = (credentials) => send("post", "/auth/login", { data: credentials })
