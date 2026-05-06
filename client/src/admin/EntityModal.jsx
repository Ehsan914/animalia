// import { useEffect, useRef } from "react"
// import { createPortal } from "react-dom"
// import { ChevronDown, X } from "lucide-react"
// import Button from "../components/ui/Button"
// import { PixelHeart } from "../components/icons/pixel-icons"
// import SpecialityCheckboxes from "../components/ui/SpecialityCheckbox"

// const EntityModal = ({
//     fields = [],
//     formData = {},
//     onChange,
//     onSubmit,
//     onClose,
//     mode = "add",
//     title,
//     entityLabel = "Entry",
//     specialityOptions = [],
//     onGenerateSlug,
// }) => {
//     const overlayRef = useRef(null)

//     // Close on Escape key
//     useEffect(() => {
//         const handler = (e) => { if (e.key === "Escape") onClose() }
//         document.addEventListener("keydown", handler)
//         return () => document.removeEventListener("keydown", handler)
//     }, [onClose])

//     // Lock body scroll while open
//     useEffect(() => {
//         document.body.style.overflow = "hidden"
//         return () => { document.body.style.overflow = "" }
//     }, [])

//     const handleChange = (name, type, value) => {
//         // Coerce number fields
//         onChange(name, type === "number" ? (value === "" ? "" : Number(value)) : value)
//     }

//     const handleSubmit = (e) => {
//         e.preventDefault()
//         onSubmit(formData)
//     }

//     const headingText = title ?? (mode === "edit" ? `Edit ${entityLabel}` : `Add New ${entityLabel}`)
//     const submitLabel = mode === "edit" ? "Confirm Edit" : `Add ${entityLabel}`

//     const modal = (
//         <div
//             ref={overlayRef}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10"
//         >
//             <div className="max-w-160 w-full max-h-[90vh] overflow-y-auto bg-white px-7 py-9 border-4 border-mc-primary shadow-mc-sharp-lg-b">
//                 <form onSubmit={handleSubmit} className="flex flex-col gap-7.5">
//                     {/* Header */}
//                     <div className="flex items-center justify-between">
//                         <h1 className="text-3xl sm:text-4xl font-pixel-alt text-black/90 leading-7.5">
//                             {headingText}
//                         </h1>
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="p-1 hover:bg-black/5 transition-colors cursor-pointer"
//                             aria-label="Close"
//                         >
//                             <X size={32} />
//                         </button>
//                     </div>

//                     {/* Fields */}
//                     <div className="flex flex-col gap-7.5">
//                         {fields.map((field) => (
//                             <div key={field.name} className="flex flex-col gap-2.5">
//                                 <label className="text-[15px] font-sans font-semibold text-black">
//                                     {field.label}
//                                     {field.required && (
//                                         <span className="text-red-500 ml-1">*</span>
//                                     )}
//                                 </label>

//                                 {field.type === "textarea" ? (
//                                     <textarea
//                                         value={formData[field.name] ?? ""}
//                                         onChange={(e) => handleChange(field.name, "textarea", e.target.value)}
//                                         placeholder={field.placeholder}
//                                         required={field.required}
//                                         rows={4}
//                                         className="border-4 border-mc-primary bg-white px-3 py-3 text-sm font-sans font-medium resize-y"
//                                     />
//                                 ) : field.type === "multiselect-creatable" ? (
//                                     <SpecialityCheckboxes
//                                         options={specialityOptions}
//                                         selectedIds={formData[field.name] ?? []}
//                                         onChange={(updated) => onChange(field.name, updated)}
//                                         onAdd={field.onAdd}
//                                         onDelete={field.onDelete}
//                                     />
//                                 ) : field.type === "checkbox" ? (
//                                     (() => {
//                                         const isDisabled = field.disabledWhen ? field.disabledWhen(formData) : false
//                                         return (
//                                             <div className="flex flex-col gap-2">
//                                                 <div className={`flex gap-3 ${isDisabled ? "opacity-40 pointer-events-none" : ""}`}>
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => onChange(field.name, true)}
//                                                         className={`px-4 py-2 border-4 font-pixel-alt text-[16px] transition-colors cursor-pointer ${
//                                                             formData[field.name] === true
//                                                                 ? "border-mc-primary bg-mc-grass text-white shadow-mc-flat-b"
//                                                                 : "border-mc-primary bg-white text-black"
//                                                         }`}
//                                                     >
//                                                         Publish
//                                                     </button>
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => onChange(field.name, false)}
//                                                         className={`px-4 py-2 border-4 font-pixel-alt text-[16px] transition-colors cursor-pointer ${
//                                                             formData[field.name] === false || formData[field.name] === undefined
//                                                                 ? "border-mc-heart bg-red-600 text-white shadow-mc-flat-b"
//                                                                 : "border-mc-heart bg-white text-black"
//                                                         }`}
//                                                     >
//                                                         Unpublish
//                                                     </button>
//                                                 </div>
//                                                 {isDisabled && (
//                                                     <p className="text-xs font-sans text-black/40">
//                                                         Only approved reviews can be published.
//                                                     </p>
//                                                 )}
//                                             </div>
//                                         )
//                                 })()) : field.type === "approval" ? (
//                                     <div className="flex gap-3">
//                                         <button
//                                             type="button"
//                                             onClick={() => onChange(field.name, true)}
//                                             className={`px-4 py-2 border-4 font-pixel-alt text-[16px] transition-colors cursor-pointer ${
//                                                 formData[field.name] === true || formData[field.name] === undefined
//                                                     ? "border-mc-primary bg-mc-grass text-white shadow-mc-flat-b"
//                                                     : "border-mc-primary bg-white text-black"
//                                             }`}
//                                         >
//                                             Approve
//                                         </button>
//                                         <button
//                                             type="button"
//                                             onClick={() => onChange(field.name, false)}
//                                             className={`px-4 py-2 border-4 font-pixel-alt text-[16px] transition-colors cursor-pointer ${
//                                                 formData[field.name] === false
//                                                     ? "border-mc-heart bg-red-600 text-white shadow-mc-flat-b"
//                                                     : "border-mc-heart bg-white text-black"
//                                             }`}
//                                         >
//                                             Reject
//                                         </button>
//                                     </div>
//                                 ) : field.type === "rating" ? (
//                                     <div className="flex gap-1.5">
//                                         {[1, 2, 3, 4, 5].map((i) => (
//                                             <button
//                                                 key={i}
//                                                 type="button"
//                                                 onClick={() => onChange(field.name, i)}
//                                                 className="cursor-pointer hover:scale-110 transition-transform"
//                                                 aria-label={`Rate ${i}`}
//                                             >
//                                                 <PixelHeart
//                                                     className={`w-6 h-6 ${
//                                                         i <= (formData[field.name] || 0)
//                                                             ? "text-mc-heart"
//                                                             : "text-gray-300"
//                                                     }`}
//                                                 />
//                                             </button>
//                                         ))}
//                                     </div>
//                                 ) : field.generateable ? (
//                                     <div className="flex border-4 border-mc-primary">
//                                         <input
//                                             type="text"
//                                             value={formData[field.name] ?? ""}
//                                             onChange={(e) => handleChange(field.name, "text", e.target.value)}
//                                             placeholder={field.placeholder}
//                                             required={field.required}
//                                             className="flex-1 bg-white px-3 py-3 text-sm font-sans font-medium outline-none"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={onGenerateSlug}
//                                             className="px-4 py-2 bg-mc-grass text-white font-pixel-alt text-[14px] border-l-4 border-mc-primary hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
//                                         >
//                                             Generate
//                                         </button>
//                                     </div>
//                                 ) : (
//                                     <input
//                                         type={field.type}
//                                         value={formData[field.name] ?? ""}
//                                         onChange={(e) => handleChange(field.name, field.type, e.target.value)}
//                                         placeholder={field.placeholder}
//                                         required={field.required}
//                                         className="border-4 border-mc-primary bg-white px-3 py-3 text-sm font-sans font-medium"
//                                     />
//                                 )}
//                             </div>
//                         ))}
//                     </div>

//                     <Button type="submit" className="font-pixel-alt text-2xl font-medium py-2 shadow-mc-sharp-b">
//                         {submitLabel}
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     )

//     return createPortal(modal, document.body)
// }

//export default EntityModal



import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import Button from "../components/ui/Button"
import { PixelHeart } from "../components/icons/pixel-icons"
import SpecialityCheckboxes from "../components/ui/SpecialityCheckbox"
import ServiceCheckboxes from "../components/ui/Servicecheckboxes"

const EntityModal = ({
    fields = [],
    formData = {},
    onChange,
    onSubmit,
    onClose,
    mode = "add",
    title,
    entityLabel = "Entry",
    specialityOptions = [],
    serviceOptions = [],
    onGenerateSlug,
}) => {
    const overlayRef = useRef(null)

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

    const handleChange = (name, type, value) => {
        onChange(name, type === "number" ? (value === "" ? "" : Number(value)) : value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const headingText = title ?? (mode === "edit" ? `Edit ${entityLabel}` : `Add New ${entityLabel}`)
    const submitLabel = mode === "edit" ? "Confirm Edit" : `Add ${entityLabel}`

    const modal = (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-10"
        >
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
                        {fields.map((field) => (
                            <div key={field.name} className="flex flex-col gap-2.5">
                                <label className="text-[15px] font-sans font-semibold text-black">
                                    {field.label}
                                    {field.required && (
                                        <span className="text-red-500 ml-1">*</span>
                                    )}
                                </label>

                                {field.type === "textarea" ? (
                                    <textarea
                                        value={formData[field.name] ?? ""}
                                        onChange={(e) => handleChange(field.name, "textarea", e.target.value)}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        rows={4}
                                        className="border-4 border-mc-primary bg-white px-3 py-3 text-sm font-sans font-medium resize-y"
                                    />
                                ) : field.type === "multiselect-creatable" ? (
                                    <SpecialityCheckboxes
                                        options={specialityOptions}
                                        selectedIds={formData[field.name] ?? []}
                                        onChange={(updated) => onChange(field.name, updated)}
                                        onAdd={field.onAdd}
                                        onDelete={field.onDelete}
                                    />
                                ) : field.type === "service-multiselect" ? (
                                    <ServiceCheckboxes
                                        options={serviceOptions}
                                        selectedIds={formData[field.name] ?? []}
                                        onChange={(updated) => onChange(field.name, updated)}
                                    />
                                ) : field.type === "checkbox" ? (
                                    (() => {
                                        const isDisabled = field.disabledWhen ? field.disabledWhen(formData) : false
                                        return (
                                            <div className="flex flex-col gap-2">
                                                <div className={`flex gap-3 ${isDisabled ? "opacity-40 pointer-events-none" : ""}`}>
                                                    <button
                                                        type="button"
                                                        onClick={() => onChange(field.name, true)}
                                                        className={`px-4 py-2 border-4 font-pixel-alt text-[16px] transition-colors cursor-pointer ${
                                                            formData[field.name] === true
                                                                ? "border-mc-primary bg-mc-grass text-white shadow-mc-flat-b"
                                                                : "border-mc-primary bg-white text-black"
                                                        }`}
                                                    >
                                                        Publish
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => onChange(field.name, false)}
                                                        className={`px-4 py-2 border-4 font-pixel-alt text-[16px] transition-colors cursor-pointer ${
                                                            formData[field.name] === false || formData[field.name] === undefined
                                                                ? "border-mc-heart bg-red-600 text-white shadow-mc-flat-b"
                                                                : "border-mc-heart bg-white text-black"
                                                        }`}
                                                    >
                                                        Unpublish
                                                    </button>
                                                </div>
                                                {isDisabled && (
                                                    <p className="text-xs font-sans text-black/40">
                                                        Only approved reviews can be published.
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    })()
                                ) : field.type === "approval" ? (
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => onChange(field.name, true)}
                                            className={`px-4 py-2 border-4 font-pixel-alt text-[16px] transition-colors cursor-pointer ${
                                                formData[field.name] === true || formData[field.name] === undefined
                                                    ? "border-mc-primary bg-mc-grass text-white shadow-mc-flat-b"
                                                    : "border-mc-primary bg-white text-black"
                                            }`}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onChange(field.name, false)}
                                            className={`px-4 py-2 border-4 font-pixel-alt text-[16px] transition-colors cursor-pointer ${
                                                formData[field.name] === false
                                                    ? "border-mc-heart bg-red-600 text-white shadow-mc-flat-b"
                                                    : "border-mc-heart bg-white text-black"
                                            }`}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                ) : field.type === "rating" ? (
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => onChange(field.name, i)}
                                                className="cursor-pointer hover:scale-110 transition-transform"
                                                aria-label={`Rate ${i}`}
                                            >
                                                <PixelHeart
                                                    className={`w-6 h-6 ${
                                                        i <= (formData[field.name] || 0)
                                                            ? "text-mc-heart"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                ) : field.generateable ? (
                                    <div className="flex border-4 border-mc-primary">
                                        <input
                                            type="text"
                                            value={formData[field.name] ?? ""}
                                            onChange={(e) => handleChange(field.name, "text", e.target.value)}
                                            placeholder={field.placeholder}
                                            required={field.required}
                                            className="flex-1 bg-white px-3 py-3 text-sm font-sans font-medium outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={onGenerateSlug}
                                            className="px-4 py-2 bg-mc-grass text-white font-pixel-alt text-[14px] border-l-4 border-mc-primary hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                ) : (
                                    <input
                                        type={field.type}
                                        value={formData[field.name] ?? ""}
                                        onChange={(e) => handleChange(field.name, field.type, e.target.value)}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        className="border-4 border-mc-primary bg-white px-3 py-3 text-sm font-sans font-medium"
                                    />
                                )}
                            </div>
                        ))}
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