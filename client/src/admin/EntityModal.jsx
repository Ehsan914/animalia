import { useEffect } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import Button from "../components/ui/Button"
import { Heart, HeartOff } from "../components/icons/pixel-icons"
import SpecialityCheckboxes from "../components/ui/SpecialityCheckbox"
import ServiceCheckboxes from "../components/ui/Servicecheckboxes"
import { SERVICE_ICON_MAP } from "../constants/serviceIcons"

const inputClass = "border-4 border-mc-primary bg-white px-3 py-3 text-sm font-sans font-medium"
const choiceBase = "px-4 py-2 border-4 font-pixel-alt text-[16px] transition-colors cursor-pointer"
const chosen = "border-mc-primary bg-mc-grass text-white shadow-mc-flat-b"
const notChosen = "border-mc-primary bg-white text-black hover:bg-black/5"

/*
 * One component per field `type`. Each receives the field config, the field's
 * value, the whole form (for fields that depend on others) and onChange(value).
 * A field config is { name, label, type, required?, placeholder?, ...extras },
 * where the extras are documented on the component that reads them.
 */

const TextInput = ({ field, value, onChange }) => (
    <input
        type={field.type}
        value={value ?? ""}
        onChange={(e) => onChange(field.type === "number" && e.target.value !== "" ? Number(e.target.value) : e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        className={inputClass}
    />
)

const TextArea = ({ field, value, onChange }) => (
    <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        required={field.required}
        rows={4}
        className={`${inputClass} resize-y`}
    />
)

// extras: generate(formData) → value, or undefined to leave the field alone
const SlugInput = ({ field, value, formData, onChange }) => (
    <div className="flex border-4 border-mc-primary">
        <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="flex-1 bg-white px-3 py-3 text-sm font-sans font-medium outline-none"
        />
        <button
            type="button"
            onClick={() => {
                const generated = field.generate(formData)
                if (generated !== undefined) onChange(generated)
            }}
            className="px-4 py-2 bg-mc-grass text-white font-pixel-alt text-[14px] border-l-4 border-mc-primary hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
        >
            Generate
        </button>
    </div>
)

// extras: options [{ value, label }]
const Options = ({ field, value, onChange }) => (
    <div className="flex flex-wrap gap-2">
        {field.options.map((opt) => (
            <button
                key={String(opt.value)}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`${choiceBase} ${value === opt.value ? chosen : notChosen}`}
            >
                {opt.label}
            </button>
        ))}
    </div>
)

// A publish/unpublish toggle. extras: disabledWhen(formData), disabledHint
const PublishToggle = ({ field, value, formData, onChange }) => {
    const isDisabled = field.disabledWhen?.(formData) ?? false
    return (
        <div className="flex flex-col gap-2">
            <div className={`flex gap-3 ${isDisabled ? "opacity-40 pointer-events-none" : ""}`}>
                <button
                    type="button"
                    onClick={() => onChange(true)}
                    className={`${choiceBase} ${value === true ? chosen : "border-mc-primary bg-white text-black"}`}
                >
                    Publish
                </button>
                <button
                    type="button"
                    onClick={() => onChange(false)}
                    className={`${choiceBase} ${value !== true
                        ? "border-mc-heart bg-red-600 text-white shadow-mc-flat-b"
                        : "border-mc-heart bg-white text-black"}`}
                >
                    Unpublish
                </button>
            </div>
            {isDisabled && field.disabledHint && (
                <p className="text-xs font-sans text-black/40">{field.disabledHint}</p>
            )}
        </div>
    )
}

const Rating = ({ value, onChange }) => (
    <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
            <button
                key={i}
                type="button"
                onClick={() => onChange(i)}
                className="cursor-pointer hover:scale-110 transition-transform"
                aria-label={`Rate ${i}`}
            >
                {i <= (value || 0) ? <Heart className="w-6 h-6" /> : <HeartOff className="w-6 h-6" />}
            </button>
        ))}
    </div>
)

const IconPicker = ({ value, onChange }) => (
    <div className="flex flex-wrap gap-2">
        {Object.entries(SERVICE_ICON_MAP).map(([key, entry]) => {
            const IconComponent = entry.Icon
            return (
                <button
                    key={key}
                    type="button"
                    onClick={() => onChange(key)}
                    title={entry.label}
                    className={`flex flex-col items-center gap-1.5 px-3 py-2.5 border-4 transition-colors cursor-pointer ${value === key ? chosen : notChosen}`}
                >
                    <IconComponent className="w-7 h-7" />
                    <span className="text-[10px] font-pixel-alt leading-none">{entry.label}</span>
                </button>
            )
        })}
    </div>
)

// extras: options [{ value, label }]
const MultiSelect = ({ field, value, onChange }) => (
    <ServiceCheckboxes options={field.options} selectedIds={value ?? []} onChange={onChange} />
)

// A multi-select whose options the admin can add and delete.
// extras: options [{ value, label }], onAdd(name), onDelete(value)
const CreatableMultiSelect = ({ field, value, onChange }) => (
    <SpecialityCheckboxes
        options={field.options}
        selectedIds={value ?? []}
        onChange={onChange}
        onAdd={field.onAdd}
        onDelete={field.onDelete}
    />
)

const FIELD_TYPES = {
    textarea: TextArea,
    slug: SlugInput,
    options: Options,
    publish: PublishToggle,
    rating: Rating,
    "icon-picker": IconPicker,
    multiselect: MultiSelect,
    "multiselect-creatable": CreatableMultiSelect,
}

const EntityModal = ({
    fields = [],
    formData = {},
    onChange,
    onSubmit,
    onClose,
    mode = "add",
    title,
    entityLabel = "Entry",
}) => {
    // Close on Escape key
    useEffect(() => {
        const handler = (e) => { if (e.key === "Escape") onClose() }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [onClose])

    // Lock body scroll while open
    useEffect(() => {
        document.body.style.overflow = "hidden"
        return () => { document.body.style.overflow = "" }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const headingText = title ?? (mode === "edit" ? `Edit ${entityLabel}` : `Add New ${entityLabel}`)
    const submitLabel = mode === "edit" ? "Confirm Edit" : `Add ${entityLabel}`

    const modal = (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10">
            <div className="max-w-160 w-full max-h-[90vh] overflow-y-auto bg-white px-7 py-9 border-4 border-mc-primary shadow-mc-sharp-lg-b">
                <form onSubmit={handleSubmit} className="flex flex-col gap-7.5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl sm:text-4xl font-pixel-alt text-black/90 leading-7.5">
                            {headingText}
                        </h1>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1 hover:bg-black/5 transition-colors cursor-pointer"
                            aria-label="Close"
                        >
                            <X size={32} />
                        </button>
                    </div>

                    {/* Fields */}
                    <div className="flex flex-col gap-7.5">
                        {fields.map((field) => {
                            const Field = FIELD_TYPES[field.type] ?? TextInput
                            return (
                                <div key={field.name} className="flex flex-col gap-2.5">
                                    <label className="text-[15px] font-sans font-semibold text-black">
                                        {field.label}
                                        {field.required && (
                                            <span className="text-red-500 ml-1">*</span>
                                        )}
                                    </label>
                                    <Field
                                        field={field}
                                        value={formData[field.name]}
                                        formData={formData}
                                        onChange={(value) => onChange(field.name, value)}
                                    />
                                </div>
                            )
                        })}
                    </div>

                    <Button type="submit" className="font-pixel-alt text-2xl font-medium py-2 shadow-mc-sharp-b">
                        {submitLabel}
                    </Button>
                </form>
            </div>
        </div>
    )

    return createPortal(modal, document.body)
}

export default EntityModal
