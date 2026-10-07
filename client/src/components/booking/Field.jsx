// One labelled text input (or textarea) with its error line underneath.
export default function Field({ id, label, optional, error, value, onChange, multiline, ...inputProps }) {
    const Control = multiline ? "textarea" : "input"
    return (
        <div className="field">
            <label htmlFor={id}>
                {label}
                {optional && <span className="optional">Optional</span>}
            </label>
            <Control
                id={id}
                name={id}
                value={value}
                onChange={(e) => onChange(id, e.target.value)}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                {...inputProps}
            />
            <p className="field-error" id={`${id}-error`}>{error}</p>
        </div>
    )
}
