import { twMerge } from "tailwind-merge"

const base = "font-pixel px-8 py-4 text-xs shadow-mc-sharp active:translate-y-px active:shadow-mc-flat transition-all duration-150 cursor-pointer"

const variants = {
    primary: "bg-mc-grass text-white border-4 border-mc-primary",
    outline: "bg-transparent text-mc-black border-4 border-mc-primary",
    ghost:   "bg-transparent text-mc-primary border-4 border-transparent",
}

// Button styling, for <Button> and for links that should look like one
// (a link inside a <button> is invalid and only its text is clickable).
export const buttonClassName = (variant = "primary", className = "") =>
    twMerge(`${base} ${variants[variant]} ${className}`)
