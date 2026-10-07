import { useEffect, useState } from "react"

// `value` once it has stopped changing for `delay` ms. Used so a photo link being
// typed loads its image once, not once per keystroke.
export default function useDebouncedValue(value, delay = 400) {
    const [settled, setSettled] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setSettled(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return settled
}
