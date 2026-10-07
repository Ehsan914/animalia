import { useLayoutEffect, useRef, useState } from "react"
import Icon from "./Icon"

// Segmented control: one navy plate slides between the options (a radiogroup).
// Click or arrow keys select; `options` is [{ value, label, icon? }].
export default function Seg({ options, value, onChange, label, className = "" }) {
    const groupRef = useRef(null)
    const [plate, setPlate] = useState(null)
    // The first placement must not slide in from the left edge.
    const [animate, setAnimate] = useState(false)

    useLayoutEffect(() => {
        const group = groupRef.current
        const place = () => {
            const btn = group?.querySelector('[aria-checked="true"]')
            if (btn) setPlate({ width: btn.offsetWidth, x: btn.offsetLeft - 4 })
        }
        place()
        document.fonts?.ready.then(place)
        window.addEventListener("resize", place)
        return () => window.removeEventListener("resize", place)
    }, [value, options])

    useLayoutEffect(() => {
        if (!plate || animate) return
        const id = requestAnimationFrame(() => setAnimate(true))
        return () => cancelAnimationFrame(id)
    }, [plate, animate])

    const select = (next, focus) => {
        if (next === value) return
        onChange(next)
        if (focus) groupRef.current?.querySelector(`[data-value="${CSS.escape(String(next))}"]`)?.focus()
    }

    const onKeyDown = (e) => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]
        if (!step) return
        e.preventDefault()
        const i = options.findIndex((o) => o.value === value)
        select(options[(i + step + options.length) % options.length].value, true)
    }

    return (
        <div ref={groupRef} className={`seg ${className}`.trim()} role="radiogroup" aria-label={label} onKeyDown={onKeyDown}>
            <span
                className={`seg-slider${animate ? "" : " no-anim"}`}
                style={plate ? { width: plate.width, transform: `translateX(${plate.x}px)` } : undefined}
            />
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    role="radio"
                    data-value={o.value}
                    aria-checked={o.value === value}
                    tabIndex={o.value === value ? 0 : -1}
                    onClick={() => select(o.value, false)}
                >
                    {o.icon && <Icon name={o.icon} />}
                    {o.label}
                </button>
            ))}
        </div>
    )
}
