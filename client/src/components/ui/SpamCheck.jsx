import { useRef, useState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY
const WIDGET_HEIGHT = 65

// scripts/prerender.js sets this. The widget is for live visitors only: baked
// into static HTML, its script would load before React and could stall it.
const isPrerendering = () => typeof window !== "undefined" && window.__PRERENDER__ === true

/**
 * Cloudflare Turnstile for a public form; server/lib/turnstile.js checks the
 * token. `token` is null until the visitor passes. Send it as `turnstileToken`
 * and call `reset()` after every submit attempt, since a token works only once.
 */
export function useSpamCheck() {
    const ref = useRef(null)
    const [token, setToken] = useState(null)
    const clear = () => setToken(null)

    const reset = () => {
        clear()
        ref.current?.reset()
    }

    const widget = (
        <div style={{ minHeight: WIDGET_HEIGHT }}>
            {!isPrerendering() && (
                <Turnstile
                    ref={ref}
                    siteKey={SITE_KEY}
                    onSuccess={setToken}
                    onExpire={clear}
                    onError={clear}
                />
            )}
        </div>
    )

    return { token, reset, widget }
}
