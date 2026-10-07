import { isSlotPast } from "./schedule"

// Day strip and time grid. Both are radiogroups of buttons; a slot that has
// already started today is disabled.
export default function WhenStep({ days, slots, day, time, error, now, onDay, onTime }) {
    const pickedDay = days.find((d) => d.key === day)
    return (
        <fieldset className="step">
            <legend>When</legend>
            <span className="label" id="date-label">Day</span>
            <div className="days" id="days" role="radiogroup" aria-labelledby="date-label">
                {days.map((d) => (
                    <button
                        key={d.key}
                        type="button"
                        className="day"
                        role="radio"
                        aria-checked={d.key === day}
                        aria-label={d.label}
                        onClick={() => onDay(d.key)}
                    >
                        <small>{d.isToday ? "Today" : d.weekday}</small>
                        <b>{d.dayOfMonth}</b>
                    </button>
                ))}
            </div>
            <span className="label" id="time-label">Time</span>
            {slots.length > 0 ? (
                <div className="times" id="times" role="radiogroup" aria-labelledby="time-label">
                    {slots.map((slot) => (
                        <button
                            key={slot}
                            type="button"
                            className="time"
                            role="radio"
                            aria-checked={slot === time}
                            disabled={isSlotPast(slot, pickedDay, now)}
                            onClick={() => onTime(slot)}
                        >
                            {slot}
                        </button>
                    ))}
                </div>
            ) : (
                <p className="hint">Opening hours could not be loaded. Refresh the page to pick a time.</p>
            )}
            <p className="field-error" id="when-error">{error}</p>
        </fieldset>
    )
}
