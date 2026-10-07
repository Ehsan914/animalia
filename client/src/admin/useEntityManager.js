import { useCallback, useEffect, useState } from "react"
import toast from "react-hot-toast"

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

    const load = useCallback(() =>
        resource.adminList()
            .then(setRows)
            .catch((err) => toast.error(`Could not load ${label.toLowerCase()} list: ${err.message}`))
            .finally(() => setLoading(false)),
    [resource, label])

    useEffect(() => {
        load()
    }, [load])

    const openAdd = () => setModal({ mode: "add", form: emptyForm(rows), key: null })
    const openEdit = (record) => setModal({ mode: "edit", form: toForm(record), key: keyOf(record) })
    const closeModal = () => setModal(null)
    const changeField = (name, value) =>
        setModal((current) => ({ ...current, form: { ...current.form, [name]: value } }))

    const replaceRow = (record) =>
        setRows((current) => current.map((row) => (keyOf(row) === keyOf(record) ? record : row)))

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
            toast.success(`${label} ${mode === "add" ? "added" : "saved"}`)
            setModal(null)
        } catch (err) {
            toast.error(err.message)
        }
    }

    const remove = async (record) => {
        try {
            await resource.remove(keyOf(record))
            setRows((current) => current.filter((row) => keyOf(row) !== keyOf(record)))
            toast.success(`${label} deleted`)
        } catch (err) {
            toast.error(err.message)
        }
    }

    return { rows, loading, modal, openAdd, openEdit, closeModal, changeField, submit, remove, replaceRow }
}
