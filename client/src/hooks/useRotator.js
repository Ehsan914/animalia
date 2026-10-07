import { useCallback, useEffect, useRef, useState } from "react"

const prefersReducedMotion = () =>
    typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Timed rotation shared by the hero banners and the home reviews. One dot per
 * item; the active dot fills over that item's seconds (CSS `timer-progress`) and
 * its animationend moves on, so CSS owns the timing and a pause is just
 * animation-play-state. Pauses on hover, keyboard focus, off screen, a hidden tab
 * or the pause button. With reduced motion nothing advances by itself.
 *
 *   const { index, step, areaRef, areaProps, controlsProps } = useRotator({ name, labels, seconds })
 *   <div ref={areaRef} {...areaProps}>…</div>
 *   <TimerControls {...controlsProps} />
 */
export default function useRotator({ name, labels, seconds }) {
    const count = labels.length
    const areaRef = useRef(null)
    const [index, setIndex] = useState(0)
    const [still] = useState(prefersReducedMotion)
    const [pauses, setPauses] = useState(() => new Set(still ? ["motion", "offscreen"] : ["offscreen"]))

    const setPause = useCallback((reason, on) => {
        setPauses((prev) => {
            if (prev.has(reason) === on) return prev
            const next = new Set(prev)
            if (on) next.add(reason)
            else next.delete(reason)
            return next
        })
    }, [])

    // A list that shrinks (e.g. an admin preview) must not leave the index past the end.
    const current = count ? index % count : 0

    const show = useCallback((i) => setIndex(((i % count) + count) % count), [count])
    const step = useCallback((by) => show(current + by), [show, current])

    useEffect(() => {
        const onVisibility = () => setPause("hidden", document.hidden)
        document.addEventListener("visibilitychange", onVisibility)
        return () => document.removeEventListener("visibilitychange", onVisibility)
    }, [setPause])

    useEffect(() => {
        const area = areaRef.current
        if (!area || typeof IntersectionObserver === "undefined") {
            setPause("offscreen", false)
            return
        }
        const observer = new IntersectionObserver(([entry]) => setPause("offscreen", !entry.isIntersecting))
        observer.observe(area)
        return () => observer.disconnect()
    }, [setPause])

    const areaProps = {
        onPointerEnter: () => setPause("hover", true),
        onPointerLeave: () => setPause("hover", false),
        // Keyboard focus pauses; a mouse click on a control does not (Play must resume at once).
        onFocus: (e) => setPause("focus", e.target.matches(":focus-visible")),
        onBlur: (e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPause("focus", false)
        },
    }

    const controlsProps = {
        name,
        labels,
        seconds,
        index: current,
        paused: pauses.size > 0,
        userPaused: pauses.has("user"),
        still,
        onSelect: (i) => { if (i !== current) show(i) },
        onAdvance: () => show(current + 1),
        onToggle: () => setPause("user", !pauses.has("user")),
    }

    return { index: current, step, areaRef, areaProps, controlsProps }
}
