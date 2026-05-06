import { twMerge } from "tailwind-merge"

export default function Button({ variant = "primary", children, onClick, className = "" }) {
    
    const base = "font-pixel px-8 py-4 text-xs shadow-mc-sharp active:translate-y-px active:shadow-mc-flat transition-all duration-150 cursor-pointer";

    const variants = {
        primary: "bg-mc-grass text-white border-4 border-mc-primary",
        outline: "bg-transparent text-mc-black border-4 border-mc-primary",
        ghost:   "bg-transparent text-mc-primary border-4 border-transparent",
    }

    return (
        <button
            onClick={onClick}
            className={twMerge(`${base} ${variants[variant]} ${className}`)}
        >
            {children}
        </button>
    )
}