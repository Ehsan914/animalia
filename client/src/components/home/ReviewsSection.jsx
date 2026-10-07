import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import Icon from "../ui/Icon"
import ReviewCard from "./ReviewCard"
import TimerControls from "../ui/TimerControls"
import { ReviewModal } from "../ui/ReviewModal"
import useRotator from "../../hooks/useRotator"
import { gsap, motionAllowed } from "./motion"

const SECONDS = 7
const CARDS = 3 // one lead review on navy, two beside it on paper

// The cards settle in, in reading order, the first time the section comes into view.
function useReviewsEntrance(sectionRef) {
    useLayoutEffect(() => {
        const section = sectionRef.current
        if (!section || !motionAllowed()) return
        const ctx = gsap.context(() => {
            gsap.from(".review", {
                scrollTrigger: { trigger: section, start: "top 75%", once: true },
                y: 24, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
            })
        }, section)
        return () => ctx.revert()
    }, [sectionRef])
}

// "What pet parents say": every approved review takes a turn in the three cards.
export default function ReviewsSection({ reviews }) {
    const [writing, setWriting] = useState(false)
    const [live, setLive] = useState("off")
    const [animate] = useState(motionAllowed)
    const sectionRef = useRef(null)
    useReviewsEntrance(sectionRef)

    const labels = useMemo(() => reviews.map((r) => `Review from ${r.author}`), [reviews])
    const seconds = useMemo(() => reviews.map(() => SECONDS), [reviews])
    const { index, areaRef, areaProps, controlsProps } = useRotator({ name: "reviews", labels, seconds })
    const { onPointerEnter, onPointerLeave, ...focusProps } = areaProps

    // A new width means new heights: drop the held one.
    useEffect(() => {
        const release = () => { if (areaRef.current) areaRef.current.style.minHeight = "" }
        window.addEventListener("resize", release)
        return () => window.removeEventListener("resize", release)
    }, [areaRef])

    // Hold the tallest height so nothing below jumps while the words swap.
    const holdHeight = () => {
        const grid = areaRef.current
        if (grid) grid.style.minHeight = `${Math.max(grid.offsetHeight, parseFloat(grid.style.minHeight) || 0)}px`
    }
    // Announce only what the visitor chose, never the timed turns.
    const controls = {
        ...controlsProps,
        onSelect: (i) => { holdHeight(); setLive("polite"); controlsProps.onSelect(i) },
        onAdvance: () => { holdHeight(); setLive("off"); controlsProps.onAdvance() },
    }

    const count = Math.min(CARDS, reviews.length)

    return (
        <section className="reviews" aria-labelledby="reviews-title" ref={sectionRef} {...focusProps}>
            <div className="wrap">
                <div className="reviews-head">
                    <h2 className="h2 section-title" id="reviews-title">What pet parents say</h2>
                    <button className="btn btn--line" type="button" onClick={() => setWriting(true)}>
                        Write a review <Icon name="pencil-simple" />
                    </button>
                </div>

                {count > 0 ? (
                    <div className="reviews-grid" ref={areaRef} aria-live={live} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
                        {Array.from({ length: count }, (_, i) => (
                            <ReviewCard key={i} review={reviews[(index + i) % reviews.length]} lead={i === 0} order={i} animate={animate} />
                        ))}
                    </div>
                ) : (
                    <p className="reviews-empty">No reviews yet. Tell us how your pet's visit went.</p>
                )}
                <TimerControls {...controls} className="review-controls" />
            </div>

            <ReviewModal isOpen={writing} onClose={() => setWriting(false)} />
        </section>
    )
}
