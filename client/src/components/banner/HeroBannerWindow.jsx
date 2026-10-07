import { useRef } from "react"
import useRotator from "../../hooks/useRotator"
import TimerControls from "../ui/TimerControls"
import HeroBannerSlide from "./HeroBannerSlide"
import { displaySeconds, tone, validBg } from "./heroBanner"
import "../../styles/banner.css"

const SWIPE_PX = 40

// The hero banner window: rotates the live banners, each for its own seconds.
// With none, `fallback` (the clinic card) shows instead. The admin preview passes
// a single draft banner.
export default function HeroBannerWindow({ banners, fallback = null, className = "", id }) {
    const { index, step, areaRef, areaProps, controlsProps } = useRotator({
        name: "banners",
        labels: banners.map((b) => b.title),
        seconds: banners.map(displaySeconds),
    })
    const startX = useRef(null)

    if (!banners.length) return fallback

    // Phones: swipe the window sideways to move between banners.
    const swipe = {
        onPointerDown: (e) => { startX.current = e.clientX },
        onPointerUp: (e) => {
            if (startX.current === null || banners.length < 2) return
            const dx = e.clientX - startX.current
            startX.current = null
            if (Math.abs(dx) > SWIPE_PX) step(dx < 0 ? 1 : -1)
        },
        onPointerCancel: () => { startX.current = null },
    }

    return (
        <div
            ref={areaRef}
            id={id}
            className={`hero-window ${className}`.trim()}
            data-tone={tone(validBg(banners[index].bgColor))}
            aria-roledescription="carousel"
            aria-label="Clinic news"
            {...areaProps}
        >
            <div className="hw-slides" {...swipe}>
                {banners.map((banner, i) => (
                    <HeroBannerSlide key={banner.id ?? i} banner={banner} active={i === index} />
                ))}
            </div>
            <TimerControls {...controlsProps} className="hw-controls" />
        </div>
    )
}
