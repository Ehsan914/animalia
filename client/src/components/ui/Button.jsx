import { buttonClassName } from "./buttonClassName"

export default function Button({ variant = "primary", children, className = "", ...props }) {
    return (
        <button
            {...props}
            className={buttonClassName(variant, className)}
        >
            {children}
        </button>
    )
}
