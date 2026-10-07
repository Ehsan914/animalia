import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"
import Stamp from "../ui/Stamp"
import { skipMotion } from "./motion"

// One slip line. Ink settles in when the line is first written, and on every
// change of a picked value, but not on each keystroke of a typed one.
function SlipRow({ label, value, typed }) {
    const ref = useRef(null)
    const previous = useRef(value)
    const settle = useRef(null)

    // Only unmounting stops a settle: the next keystroke must not freeze it half-inked.
    useLayoutEffect(() => () => settle.current?.kill(), [])

    useLayoutEffect(() => {
        const wasEmpty = !previous.current
        previous.current = value
        if (!value || skipMotion() || (typed && !wasEmpty)) return
        settle.current?.kill()
        settle.current = gsap.fromTo(
            ref.current,
            { opacity: 0, filter: "blur(3px)" },
            { opacity: 1, filter: "blur(0px)", duration: 0.35, ease: "power2.out", clearProps: "filter" },
        )
    }, [value, typed])

    return (
        <div>
            <dt>{label}</dt>
            <dd ref={ref} className={value ? undefined : "is-empty"}>{value || "—"}</dd>
        </div>
    )
}

// The appointment slip fills in as the visitor goes; a confirmed request slams
// the RECEIVED stamp onto it and the slip flinches at the moment of impact.
export default function AppointmentSlip({ rows, address, stamped }) {
    const slipRef = useRef(null)
    const stampRef = useRef(null)

    useLayoutEffect(() => {
        if (!stamped) return
        if (skipMotion()) {
            gsap.set(stampRef.current, { opacity: 0.9 })
            return
        }
        const timeline = gsap.timeline({ delay: 0.25 })
            .fromTo(
                stampRef.current,
                { scale: 1.5, opacity: 0, rotation: -16 },
                { scale: 1, opacity: 0.9, rotation: 0, duration: 0.32, ease: "back.out(2.4)" },
            )
            .to(slipRef.current, { y: 3, duration: 0.05, ease: "power1.out", yoyo: true, repeat: 1 }, 0.14)
        return () => timeline.kill()
    }, [stamped])

    return (
        <aside className="slip-col" aria-label="Your appointment so far">
            <div className="slip" ref={slipRef}>
                <div className="slip-head">
                    <p className="slip-kicker">Appointment slip</p>
                    <p className="slip-brand">Animalia Vet Care</p>
                </div>
                {/* The stamp lands on the rows, so a long address below never runs under it. */}
                <div className="slip-body">
                    <dl className="slip-rows">
                        {rows.map((row) => <SlipRow key={row.label} {...row} />)}
                    </dl>
                    <Stamp word="RECEIVED" className="slip-stamp" ref={stampRef} />
                </div>
                {address && <p className="slip-foot">{address}</p>}
            </div>
        </aside>
    )
}
