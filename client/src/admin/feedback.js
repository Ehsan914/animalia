// Admin feedback: one toast (with an optional Undo) and one confirm dialog, kept in
// small stores so hooks and pages can use them without a provider.
// FeedbackLayer.jsx renders both inside the admin root.

export const UNDO_MS = 5000

const createStore = (initial) => {
    let state = initial
    const listeners = new Set()
    return {
        get: () => state,
        set: (next) => {
            state = next
            listeners.forEach((listener) => listener())
        },
        subscribe: (listener) => {
            listeners.add(listener)
            return () => listeners.delete(listener)
        },
    }
}

/* ---------- Toast ---------- */

// { id, text, tone: "info" | "error", undo } or null
export const toastStore = createStore(null)
let toastId = 0
let toastTimer = 0

const showToast = (text, { undo = null, tone = "info" } = {}) => {
    clearTimeout(toastTimer)
    toastId += 1
    const id = toastId
    toastStore.set({ id, text, tone, undo })
    toastTimer = setTimeout(() => {
        if (toastStore.get()?.id === id) toastStore.set(null)
    }, UNDO_MS)
}

const toast = {
    show: (text, options) => showToast(text, options),
    error: (text) => showToast(text, { tone: "error" }),
    dismiss: () => {
        clearTimeout(toastTimer)
        toastStore.set(null)
    },
}

export default toast

/* ---------- Confirm ---------- */

// { title, text, ok, resolve } or null
export const confirmStore = createStore(null)

// Resolves true when the admin confirms, false when they keep it.
export const confirm = ({ title, text, ok = "Delete" }) =>
    new Promise((resolve) => {
        confirmStore.get()?.resolve(false)
        confirmStore.set({ title, text, ok, resolve })
    })

export const settleConfirm = (answer) => {
    const current = confirmStore.get()
    if (!current) return
    confirmStore.set(null)
    current.resolve(answer)
}
