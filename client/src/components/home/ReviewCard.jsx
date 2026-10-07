import { useEffect, useLayoutEffect, useRef, useState } from "react"
import Icon from "../ui/Icon"

const STARS = [1, 2, 3, 4, 5]
const OUT_MS = 220
const OUT_STAGGER_MS = 70
const IN_MS = 420
const IN_STAGGER_MS = 40
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)"

const petIcon = (species) => {
    const key = species.toLowerCase()
    return key === "dog" || key === "cat" ? key : "paw-print"
}

/**
 * One review card. When `review` changes, the old words lift away (later cards a
 * beat after earlier ones, by `order`) and the new ones settle in. Without
 * `animate` (reduced motion) the text simply changes.
 */
export default function ReviewCard({ review, lead, order, animate }) {
    const [shown, setShown] = useState(review)
    const quoteRef = useRef(null)
    const captionRef = useRef(null)
    const leaving = useRef([])

    useEffect(() => {
        if (!animate || review === shown) return
        let cancelled = false
        const out = [quoteRef.current, captionRef.current].map((el) => el.animate(
            [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(-8px)" }],
            { duration: OUT_MS, delay: order * OUT_STAGGER_MS, easing: "ease-in", fill: "forwards" },
        ))
        leaving.current = out
        Promise.all(out.map((a) => a.finished))
            .then(() => { if (!cancelled) setShown(review) })
            .catch(() => {}) // cancelled by a newer change, which takes over
        return () => { cancelled = true }
    }, [review, shown, animate, order])

    useLayoutEffect(() => {
        if (!leaving.current.length) return
        ;[quoteRef.current, captionRef.current].forEach((el, k) => {
            el.animate(
                [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
                { duration: IN_MS, delay: k * IN_STAGGER_MS, easing: EASE_OUT, fill: "backwards" },
            )
            leaving.current[k].cancel()
        })
        leaving.current = []
    }, [shown])

    const r = animate ? shown : review

    return (
        <figure className={`review${lead ? " review--lead" : ""}`}>
            <div className="review-top">
                <span className="review-mark" aria-hidden="true">“</span>
                <span className="stars" role="img" aria-label={`Rated ${r.rating} out of 5`}>
                    {STARS.map((n) => (
                        <Icon key={n} name="star" className={n > r.rating ? "is-off" : ""} />
                    ))}
                </span>
            </div>
            <blockquote ref={quoteRef}><p>{r.text}</p></blockquote>
            <figcaption ref={captionRef}>
                <span className="review-pet"><Icon name={petIcon(r.species)} /></span>
                <span><b>{r.author}</b>{r.pet_name} · {r.species}</span>
            </figcaption>
        </figure>
    )
}
