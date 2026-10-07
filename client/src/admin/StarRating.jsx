import { Heart, HeartOff } from "../components/icons/pixel-icons"

export default function StarRating({ rating }) {
    return (
        <div className="flex gap-0.5" aria-label={`${rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                i <= rating
                    ? <Heart key={i} className="w-4 h-4" />
                    : <HeartOff key={i} className="w-4 h-4" />
            ))}
        </div>
    )
}
