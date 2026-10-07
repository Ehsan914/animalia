import { useEffect, useRef, useState } from "react"
import Icon from "../components/ui/Icon"
import FormFields from "./FormFields"
import { validate } from "./formRules"

const DESKTOP = "(min-width: 900px)"
const FIRST_INPUT = ".field input:not([type=radio]):not([type=checkbox]), .field textarea"

/**
 * The add / edit dialog. Standard pages get a centred modal that ends in one
 * full-width button (phones: a full-screen sheet, the button in thumb reach).
 * With `preview` it opens wide from the right, the form beside the preview, with
 * Delete, Cancel and Save.
 *
 *   fields, values, onChange(name, value)   the form (FormFields.jsx)
 *   check(values)                            extra errors by field name
 *   onSubmit(values)                         resolves true when saved
 *   onDelete                                 wide editor only
 */
export default function EntityEditor({
    title, saveLabel, fields, values, onChange, check, onSubmit, onClose, onDelete, preview,
}) {
    const dialogRef = useRef(null)
    const formRef = useRef(null)
    const titleRef = useRef(null)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const wide = Boolean(preview)

    useEffect(() => {
        dialogRef.current.showModal()
        // Desktop: start typing in the first field. Phones: no keyboard until they tap.
        if (matchMedia(DESKTOP).matches) formRef.current.querySelector(FIRST_INPUT)?.focus()
        else titleRef.current.focus()
    }, [])

    const change = (name, value) => {
        if (errors[name]) setErrors((current) => ({ ...current, [name]: "" }))
        onChange(name, value)
    }

    const submit = async (e) => {
        e.preventDefault()
        const found = validate(fields, values, check)
        setErrors(found)
        const first = Object.keys(found)[0]
        if (first) {
            formRef.current.querySelector(`[data-field="${first}"] :is(input, textarea)`)?.focus()
            return
        }
        setSaving(true)
        const saved = await onSubmit(values)
        if (!saved) setSaving(false)
    }

    const cancel = (e) => {
        e.preventDefault()
        onClose()
    }

    const form = <FormFields fields={fields} values={values} errors={errors} onChange={change} />

    return (
        <dialog
            ref={dialogRef}
            className={`drawer ${wide ? "drawer--wide" : "drawer--modal"}`}
            aria-labelledby="drawer-title"
            onCancel={cancel}
            onClick={(e) => { if (e.target === dialogRef.current) onClose() }}
        >
            <form ref={formRef} onSubmit={submit} noValidate>
                <header className="drawer-head">
                    <h2 id="drawer-title" ref={titleRef} tabIndex={-1}>{title}</h2>
                    <button className="icon-btn" type="button" aria-label="Close" onClick={onClose}>
                        <Icon name="x" />
                    </button>
                </header>
                <div className="drawer-body">
                    {wide ? (
                        <div className="drawer-split">
                            {form}
                            <aside className="preview" aria-label="Preview">{preview}</aside>
                        </div>
                    ) : form}
                </div>
                <footer className="drawer-foot">
                    {wide && onDelete && (
                        <button className="btn btn--quiet btn--danger drawer-delete" type="button" onClick={onDelete}>
                            <Icon name="trash" />Delete
                        </button>
                    )}
                    <span className="drawer-spacer" />
                    <button className="btn btn--quiet" type="button" onClick={onClose}>Cancel</button>
                    <button className="btn drawer-save" type="submit" disabled={saving}>
                        {saving ? "Saving…" : saveLabel}
                    </button>
                </footer>
            </form>
        </dialog>
    )
}
