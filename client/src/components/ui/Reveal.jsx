import { useEffect, useRef, useState } from "react"

/**
 * Wraps content so it "bumps in" (mc-bump-in) the moment it scrolls into view,
 * instead of animating invisibly on mount. Use `delay` to stagger siblings.
 *
 *   <Reveal>...</Reveal>
 *   <Reveal as="section" delay={120} className="...">...</Reveal>
 *   <Reveal as={Link} to="/x" delay={i * 70} className="card">...</Reveal>
 */
export default function Reveal({
    as = "div",
    delay = 0,
    threshold = 0.15,
    className = "",
    style,
    children,
    ...rest
}) {
    const Tag = as
    const ref = useRef(null)
    // No IntersectionObserver (old browsers / SSR) → show immediately.
    const [shown, setShown] = useState(() => typeof IntersectionObserver === "undefined")

    useEffect(() => {
        if (shown) return
        const el = ref.current
        if (!el) return
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShown(true)
                    observer.disconnect()
                }
            },
            { threshold }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [shown, threshold])

    return (
        <Tag
            ref={ref}
            className={`${shown ? "mc-bump-in" : "opacity-0"} ${className}`}
            style={shown ? { ...style, animationDelay: `${delay}ms` } : style}
            {...rest}
        >
            {children}
        </Tag>
    )
}
