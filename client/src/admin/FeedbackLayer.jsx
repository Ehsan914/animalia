import { useEffect, useRef, useSyncExternalStore } from "react"
import Icon from "../components/ui/Icon"
import toast, { confirmStore, settleConfirm, toastStore } from "./feedback"

const useStore = (store) => useSyncExternalStore(store.subscribe, store.get)

// The toast: a manual popover, so it shows above an open dialog too.
function Toast() {
    const current = useStore(toastStore)
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el?.showPopover) return
        if (current && !el.matches(":popover-open")) el.showPopover()
        if (!current && el.matches(":popover-open")) el.hidePopover()
    }, [current])

    const undo = () => {
        const run = current?.undo
        toast.dismiss()
        run?.()
    }

    return (
        <div
            ref={ref}
            className={`toast${current?.tone === "error" ? " toast--error" : ""}`}
            popover="manual"
            role={current?.tone === "error" ? "alert" : "status"}
        >
            {current?.tone === "error" && <Icon name="warning-circle" className="toast-icon" />}
            <span>{current?.text}</span>
            {current?.undo && <button type="button" onClick={undo}>Undo</button>}
        </div>
    )
}

// Asks before anything is deleted.
function ConfirmDialog() {
    const current = useStore(confirmStore)
    const ref = useRef(null)

    useEffect(() => {
        const dlg = ref.current
        if (current && !dlg.open) dlg.showModal()
        if (!current && dlg.open) dlg.close()
    }, [current])

    const answer = (value) => (e) => {
        e.preventDefault()
        settleConfirm(value)
    }

    return (
        <dialog
            ref={ref}
            className="confirm"
            aria-labelledby="confirm-title"
            onCancel={answer(false)}
        >
            <form onSubmit={answer(true)}>
                <Icon name="warning-circle" className="confirm-icon" />
                <h2 id="confirm-title">{current?.title}</h2>
                <p>{current?.text}</p>
                <div className="confirm-actions">
                    <button className="btn btn--quiet" type="button" onClick={answer(false)}>Keep it</button>
                    <button className="btn btn--danger" type="submit">{current?.ok}</button>
                </div>
            </form>
        </dialog>
    )
}

export default function FeedbackLayer() {
    return (
        <>
            <ConfirmDialog />
            <Toast />
        </>
    )
}
