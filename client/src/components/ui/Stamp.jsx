import { forwardRef, useId } from "react"

// The circular clinic stamp ("DUE" on the care planner, "RECEIVED" on the booking
// slip, an icon such as the paw print on CTA cards). The ink filter roughens the
// edge like a rubber stamp. Each instance needs its own path/filter ids, hence useId.
const Stamp = forwardRef(function Stamp({ word, icon, className = "" }, ref) {
    const id = useId().replace(/:/g, "")
    const ring = `ring-${id}`
    const ink = `ink-${id}`
    const long = word && word.length > 4

    return (
        <svg ref={ref} className={`stamp ${className}`.trim()} viewBox="0 0 120 120" aria-hidden="true">
            <defs>
                <path id={ring} d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
                <filter id={ink}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" />
                    <feDisplacementMap in="SourceGraphic" scale="2.4" />
                </filter>
            </defs>
            <g filter={`url(#${ink})`}>
                <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="3" />
                <circle cx="60" cy="60" r="35" fill="none" stroke="currentColor" strokeWidth="1.2" />
                <text fontSize="9" fill="currentColor">
                    <textPath href={`#${ring}`} textLength="268" lengthAdjust="spacing">
                        ANIMALIA VET CARE · MIRPUR · DHAKA ·
                    </textPath>
                </text>
                {word && (
                    <text
                        className="stamp-word"
                        x="60"
                        y={long ? 65 : 68}
                        textAnchor="middle"
                        fontSize={long ? 11 : 23}
                        textLength={long ? 54 : undefined}
                        lengthAdjust={long ? "spacingAndGlyphs" : undefined}
                        fill="currentColor"
                    >
                        {word}
                    </text>
                )}
                {icon && <use href={`#i-${icon}`} x="44" y="44" width="32" height="32" fill="currentColor" />}
            </g>
        </svg>
    )
})

export default Stamp
