import { useCallback, useEffect, useRef, useState } from "react"
import toast, { UNDO_MS } from "./feedback"

/**
 * State and actions for an admin page that lists, adds, edits and deletes the
 * records of one resource (src/api/resources.js).
 *
 *   resource         { adminList, create, update, remove }
 *   label            singular name for toasts, e.g. "Service"
 *   emptyForm        (rows) => form values for a new record
 *   toForm           (record) => form values for editing it
 *   toPayload        (form) => request body; defaults to the form itself
 *   keyOf            (record) => the key the server addresses it by; defaults to id
 *   reloadAfterSave  refetch after saving, when the server changes other records
 *                    too (e.g. only one banner can be live)
 *
 * The modal is null when closed, otherwise { mode: "add" | "edit", form, key }.
 *
 * remove() hides the record at once and offers Undo; the server delete is sent when
 * the Undo window ends (or earlier: another delete, leaving the page, closing the
 * tab). Undo after a real delete would have to re-create the record, which loses its
 * id and anything linked to it (a service's appointments).
 */
export default function useEntityManager({
    resource,
    label,
    emptyForm,
    toForm,
    toPayload = (form) => form,
    keyOf = (record) => record.id,
    reloadAfterSave = false,
}) {
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(true)
    const [modal, setModal] = useState(null)
    // The delete waiting for its Undo window: { record, key, index, timer, matches }.
    const pendingDelete = useRef(null)

    // A refetch (reloadAfterSave) still finds a record whose delete is waiting on
    // the server, so it stays hidden here until the delete is sent or undone.
    const load = useCallback(() =>
        resource.adminList()
            .then((list) => {
                const waiting = pendingDelete.current
                setRows(waiting ? list.filter((row) => !waiting.matches(row)) : list)
            })
            .catch((err) => toast.error(`Could not load ${label.toLowerCase()} list: ${err.message}`))
            .finally(() => setLoading(false)),
    [resource, label])

    useEffect(() => {
        load()
    }, [load])

    const restoreRow = useCallback((record, index) =>
        setRows((current) => [...current.slice(0, index), record, ...current.slice(index)]),
    [])

    // Send the waiting delete now. On failure the record comes back.
    const commitDelete = useCallback(() => {
        const waiting = pendingDelete.current
        if (!waiting) return
        pendingDelete.current = null
        clearTimeout(waiting.timer)
        resource.remove(waiting.key).catch((err) => {
            restoreRow(waiting.record, waiting.index)
            toast.error(`Could not delete: ${err.message}`)
        })
    }, [resource, restoreRow])

    // Leaving the page or closing the tab sends a waiting delete straight away.
    useEffect(() => {
        window.addEventListener("pagehide", commitDelete)
        return () => {
            window.removeEventListener("pagehide", commitDelete)
            commitDelete()
        }
    }, [commitDelete])

    const openAdd = () => setModal({ mode: "add", form: emptyForm(rows), key: null })
    const openEdit = (record) => setModal({ mode: "edit", form: toForm(record), key: keyOf(record) })
    const closeModal = () => setModal(null)
    const changeField = (name, value) =>
        setModal((current) => ({ ...current, form: { ...current.form, [name]: value } }))

    const replaceRow = (record) =>
        setRows((current) => current.map((row) => (keyOf(row) === keyOf(record) ? record : row)))

    // Resolves true when saved (the modal closes), false when the server refused it.
    const submit = async (form) => {
        const { mode, key } = modal
        try {
            const payload = toPayload(form)
            const saved = mode === "add"
                ? await resource.create(payload)
                : await resource.update(key, payload)
            if (reloadAfterSave) {
                await load()
            } else if (mode === "add") {
                setRows((current) => [...current, saved])
            } else {
                // Match on the old key: a blog's slug can change on save.
                setRows((current) => current.map((row) => (keyOf(row) === key ? saved : row)))
            }
            toast.show(`${label} ${mode === "add" ? "added" : "saved"}`)
            setModal(null)
            return true
        } catch (err) {
            toast.error(err.message)
            return false
        }
    }

    const remove = (record) => {
        commitDelete()
        const key = keyOf(record)
        const index = rows.findIndex((row) => keyOf(row) === key)
        setRows((current) => current.filter((row) => keyOf(row) !== key))
        const waiting = { record, key, index: Math.max(index, 0), matches: (row) => keyOf(row) === key }
        waiting.timer = setTimeout(commitDelete, UNDO_MS)
        pendingDelete.current = waiting
        toast.show(`${label} deleted`, {
            undo: () => {
                if (pendingDelete.current !== waiting) return
                clearTimeout(waiting.timer)
                pendingDelete.current = null
                restoreRow(record, waiting.index)
            },
        })
    }

    /**
     * A change that takes effect at once and can be undone: `run` and `undo` each
     * send one request and resolve with the saved record. Used for moderation
     * (accept / reject) and switching a hero banner on or off. Resolves true when
     * the change was saved.
     */
    const changeWithUndo = async ({ run, undo, message }) => {
        try {
            replaceRow(await run())
        } catch (err) {
            toast.error(err.message)
            return false
        }
        toast.show(message, {
            undo: () => undo()
                .then(replaceRow)
                .catch((err) => toast.error(`Could not undo: ${err.message}`)),
        })
        return true
    }

    return { rows, loading, modal, openAdd, openEdit, closeModal, changeField, submit, remove, replaceRow, changeWithUndo }
}
