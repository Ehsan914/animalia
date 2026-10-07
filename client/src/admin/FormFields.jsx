import { useState } from "react"
import Icon from "../components/ui/Icon"
import { SERVICE_ICON_MAP } from "../constants/serviceIcons"
import { getGDriveUrl } from "../utils/gdrive"
import { isWebLink } from "./formRules"
import useDebouncedValue from "../hooks/useDebouncedValue"

/*
 * The admin form builder. A field config is
 *   { name, label, type, required?, max?, placeholder?, hint?, half?, rows?, bn? }
 * plus extras read by its type (options, generate, min, maxNum, unit, onAdd, onDelete).
 * `{ section: "Look" }` entries draw a section heading. Values are controlled:
 * onChange(name, value).
 */

const SWATCHES = ["#192f5a", "#b8392a", "#2f5d4f", "#f1e3c8", "#efc75e", "#dfe6f2", "#0f1d3a"]

const Required = ({ field }) => field.required && <span className="req" aria-hidden="true">*</span>

const Hint = ({ id, field }) => field.hint && <p className="hint" id={`${id}-hint`}>{field.hint}</p>

const ErrorLine = ({ id, error }) => <p className="field-error" id={`${id}-err`}>{error}</p>

// Props shared by every text-like control.
const inputProps = (id, field, error) => ({
    id,
    name: field.name,
    maxLength: field.max,
    placeholder: field.placeholder,
    "aria-describedby": field.hint ? `${id}-hint ${id}-err` : `${id}-err`,
    "aria-invalid": error ? true : undefined,
    "aria-required": field.required || undefined,
    lang: field.bn ? "bn" : undefined,
})

/* ---------- Controls that sit under a <label> ---------- */

function TextInput({ id, field, value, error, onChange }) {
    const isNumber = field.type === "number"
    return (
        <input
            {...inputProps(id, field, error)}
            type={field.type || "text"}
            min={isNumber ? field.min : undefined}
            max={isNumber ? field.maxNum : undefined}
            value={value ?? ""}
            onChange={(e) => onChange(isNumber && e.target.value !== "" ? Number(e.target.value) : e.target.value)}
        />
    )
}

const TextArea = ({ id, field, value, error, onChange }) => (
    <textarea
        {...inputProps(id, field, error)}
        rows={field.rows || 4}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
    />
)

const Slug = ({ id, field, value, values, error, onChange }) => (
    <div className="slug">
        <TextInput id={id} field={{ ...field, type: "text" }} value={value} error={error} onChange={onChange} />
        <button type="button" onClick={() => onChange(field.generate(values))}>Generate</button>
    </div>
)

function Image({ id, field, value, error, onChange }) {
    const link = useDebouncedValue(value)
    const src = link && isWebLink(link) ? getGDriveUrl(link) : ""
    return (
        <div className="image-field">
            <span className="thumb">{src ? <img src={src} alt="" /> : <Icon name="image-square" />}</span>
            <TextInput id={id} field={{ ...field, type: "url" }} value={value} error={error} onChange={onChange} />
        </div>
    )
}

const Range = ({ id, field, value, error, onChange }) => (
    <div className="range">
        <input
            {...inputProps(id, field, error)}
            type="range"
            min={field.min}
            max={field.max}
            value={value ?? field.min}
            onChange={(e) => onChange(Number(e.target.value))}
        />
        <output htmlFor={id}>{value ?? field.min} {field.unit}</output>
    </div>
)

/* ---------- Groups of choices, under a <legend> ---------- */

// One choice from a short list. A stored value missing from the list (older free
// text, e.g. a species) is offered too, so editing never loses it.
function Options({ field, value, onChange }) {
    const known = field.options.some((o) => o.value === value)
    const options = known || value === "" || value === null || value === undefined
        ? field.options
        : [...field.options, { value, label: String(value) }]
    return (
        <div className="choices">
            {options.map((o) => (
                <label key={String(o.value)} className={`choice${o.danger ? " choice--danger" : ""}`}>
                    <input
                        type="radio"
                        name={field.name}
                        checked={o.value === value}
                        onChange={() => onChange(o.value)}
                    />
                    <span>{o.label}</span>
                </label>
            ))}
        </div>
    )
}

// Several from a list. With onAdd / onDelete the admin can grow or trim the list.
function Checks({ field, value = [], onChange }) {
    const [draft, setDraft] = useState("")
    const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
    const add = async () => {
        const name = draft.trim()
        if (!name) return
        if (await field.onAdd(name)) setDraft("")
    }

    return (
        <>
            <div className="checks">
                {field.options.map((o) => (
                    <div key={o.value} className={field.onDelete ? "check-row" : undefined}>
                        <label className="check">
                            <input type="checkbox" name={field.name} checked={value.includes(o.value)} onChange={() => toggle(o.value)} />
                            <span>{o.label}</span>
                        </label>
                        {field.onDelete && (
                            <button
                                className="icon-btn check-remove"
                                type="button"
                                aria-label={`Remove ${o.label} from the list`}
                                onClick={() => field.onDelete(o)}
                            >
                                <Icon name="x" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {field.onAdd && (
                <div className="slug check-add">
                    <input
                        type="text"
                        value={draft}
                        maxLength={100}
                        placeholder={field.addPlaceholder}
                        aria-label={field.addPlaceholder}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }}
                    />
                    <button type="button" onClick={add}>Add</button>
                </div>
            )}
        </>
    )
}

const ServiceIcons = ({ field, value, onChange }) => (
    <div className="icon-pick">
        {Object.entries(SERVICE_ICON_MAP).map(([key, entry]) => (
            <label key={key}>
                <input type="radio" name={field.name} checked={key === value} onChange={() => onChange(key)} />
                <span><Icon name={entry.icon} /><small>{entry.label}</small></span>
            </label>
        ))}
    </div>
)

const Rating = ({ field, value, onChange }) => (
    <div className="rating-pick">
        {[1, 2, 3, 4, 5].map((n) => (
            <label key={n}>
                <input type="radio" name={field.name} checked={Number(value) === n} onChange={() => onChange(n)} />
                <span aria-hidden="true"><Icon name="star" /></span>
                <span className="sr-only">{n} star{n > 1 ? "s" : ""}</span>
            </label>
        ))}
    </div>
)

// Empty means the site's default colour: no swatch is ticked until one is picked.
function Color({ field, value, onChange }) {
    const hex = (value || "").toLowerCase()
    return (
        <div className="swatches">
            {SWATCHES.map((c) => (
                <label key={c} className="swatch" style={{ "--c": c }}>
                    <input type="radio" name={`${field.name}-pick`} checked={c === hex} onChange={() => onChange(c)} />
                    <span className="sr-only">{c}</span>
                </label>
            ))}
            <label className="swatch swatch--custom" title="Any colour">
                <input type="color" value={hex || SWATCHES[0]} aria-label="Any colour" onChange={(e) => onChange(e.target.value)} />
            </label>
            <code className="hex">{hex || "Default"}</code>
        </div>
    )
}

const LABELLED = { textarea: TextArea, slug: Slug, image: Image, range: Range }
const GROUPED = { options: Options, checks: Checks, icons: ServiceIcons, rating: Rating, color: Color }

/* ---------- One field ---------- */

function Field({ field, value, values, error, onChange }) {
    const id = `f-${field.name}`
    const cls = `field${field.half ? " field--half" : ""}`
    const change = (v) => onChange(field.name, v)

    if (field.type === "toggle") {
        return (
            <div className={`${cls} field--switch`} data-field={field.name}>
                <label className="switch">
                    <input type="checkbox" id={id} checked={Boolean(value)} onChange={(e) => change(e.target.checked)} />
                    <span className="switch-track" aria-hidden="true" />
                    <span><b>{field.label}</b>{field.hint && <small>{field.hint}</small>}</span>
                </label>
            </div>
        )
    }

    const Group = GROUPED[field.type]
    if (Group) {
        return (
            <div className={cls} data-field={field.name}>
                <fieldset aria-describedby={`${id}-err`} aria-invalid={error ? true : undefined}>
                    <legend>{field.label}<Required field={field} /></legend>
                    <Hint id={id} field={field} />
                    <Group field={field} value={value} onChange={change} />
                    <ErrorLine id={id} error={error} />
                </fieldset>
            </div>
        )
    }

    const Control = LABELLED[field.type] ?? TextInput
    return (
        <div className={cls} data-field={field.name}>
            <label htmlFor={id}>{field.label}<Required field={field} /></label>
            <Hint id={id} field={field} />
            <Control id={id} field={field} value={value} values={values} error={error} onChange={change} />
            <ErrorLine id={id} error={error} />
        </div>
    )
}

export default function FormFields({ fields, values, errors = {}, onChange }) {
    return (
        <div className="form-grid">
            {fields.map((field) => (field.section
                ? <h3 key={`section-${field.section}`} className="form-section">{field.section}</h3>
                : (
                    <Field
                        key={field.name}
                        field={field}
                        value={values[field.name]}
                        values={values}
                        error={errors[field.name]}
                        onChange={onChange}
                    />
                )))}
        </div>
    )
}
