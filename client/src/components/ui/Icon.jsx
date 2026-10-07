// One icon from the sprite in IconSprite.jsx. Decorative by default; pass `label`
// when the icon is the only thing that says what a control does.
export default function Icon({ name, className = "", label }) {
    return (
        <svg
            className={`icon icon-${name} ${className}`.trim()}
            aria-hidden={label ? undefined : "true"}
            role={label ? "img" : undefined}
            aria-label={label}
        >
            <use href={`#i-${name}`} />
        </svg>
    )
}
