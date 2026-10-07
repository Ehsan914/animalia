import { useEffect, useState } from "react"

const TICK_MS = 10_000
const FORMAT = new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka",
})

// The clinic's date and time (Dhaka), e.g. "Thursday, 8 October 2026 · 04:14".
export default function LiveDate() {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), TICK_MS)
        return () => clearInterval(timer)
    }, [])

    return <time dateTime={now.toISOString()}>{FORMAT.format(now).replace(" at ", " · ")}</time>
}
