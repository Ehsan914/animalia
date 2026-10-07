import Icon from "./Icon"

// Dots and pause button for a useRotator rotation. Hidden with fewer than two items.
export default function TimerControls({
    name, labels, seconds, index, paused, userPaused, still,
    onSelect, onAdvance, onToggle, className = "",
}) {
    if (labels.length < 2) return null

    return (
        <div className={`timer-controls ${paused ? "is-paused" : ""} ${className}`.trim()}>
            <div
                className="timer-dots"
                onAnimationEnd={(e) => { if (e.animationName === "timer-progress") onAdvance() }}
            >
                {labels.map((label, i) => (
                    <button
                        key={`${i}-${label}`}
                        type="button"
                        aria-label={label}
                        aria-current={i === index ? "true" : undefined}
                        style={{ "--dur": `${seconds[i]}s` }}
                        onClick={() => onSelect(i)}
                    >
                        <span className="timer-dot-fill" />
                    </button>
                ))}
            </div>
            {!still && (
                <button
                    type="button"
                    className="timer-toggle"
                    aria-label={`${userPaused ? "Play" : "Pause"} ${name}`}
                    onClick={onToggle}
                >
                    <Icon name={userPaused ? "play" : "pause"} />
                </button>
            )}
        </div>
    )
}
