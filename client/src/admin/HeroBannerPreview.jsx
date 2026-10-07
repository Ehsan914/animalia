import { useLayoutEffect, useRef, useState } from "react"
import Seg from "../components/ui/Seg"
import HeroBannerWindow from "../components/banner/HeroBannerWindow"
import { bannerStatus } from "../components/banner/heroBanner"
import Chip from "./Chip"
import { formatLongDay } from "./records"
import { BANNER_STATUS as STATUS } from "./heroBannerForm"
import useDebouncedValue from "../hooks/useDebouncedValue"

// The window's width beside the home page headline; the desktop preview scales it down to fit.
const DESKTOP_W = 560

const DEVICES = [
    { value: "desktop", icon: "desktop", label: <span className="sr-only">Desktop</span> },
    { value: "phone", icon: "device-mobile", label: <span className="sr-only">Phone</span> },
]

function StatusNote({ banner }) {
    if (!banner.startDate || !banner.endDate) return null
    const status = bannerStatus(banner)
    const text = {
        live: `Visitors see it now, until ${formatLongDay(`${banner.endDate}T00:00:00`)}.`,
        off: "Switched off: visitors don't see it.",
        ended: "Its end date has passed.",
    }[status]
    return <><Chip tone={STATUS[status].tone}>{STATUS[status].label}</Chip>{text}</>
}

/**
 * The editor's live preview: the same window the home page draws (HeroBannerWindow),
 * fed the banner being edited, at desktop size (scaled to fit) or as a phone shows it.
 */
export default function HeroBannerPreview({ banner }) {
    const [device, setDevice] = useState("desktop")
    const stageRef = useRef(null)
    const imageUrl = useDebouncedValue(banner.imageUrl)
    const draft = { ...banner, imageUrl, title: banner.title || "Your headline" }

    useLayoutEffect(() => {
        const stage = stageRef.current
        const fit = () => {
            const win = stage.querySelector(".hero-window")
            if (win) win.style.zoom = device === "desktop" ? String(Math.min(1, stage.clientWidth / DESKTOP_W)) : ""
        }
        fit()
        const observer = new ResizeObserver(fit)
        observer.observe(stage)
        return () => observer.disconnect()
    }, [device])

    return (
        <>
            <div className="preview-head">
                <span>Preview</span>
                <Seg options={DEVICES} value={device} onChange={setDevice} label="Preview size" />
            </div>
            <div className="preview-stage" data-stage={device} ref={stageRef}>
                <div className="preview-frame" inert>
                    <HeroBannerWindow banners={[draft]} />
                </div>
            </div>
            <p className="preview-note"><StatusNote banner={banner} /></p>
        </>
    )
}
