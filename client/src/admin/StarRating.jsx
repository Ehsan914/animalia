import Icon from "../components/ui/Icon"

// Five stars, filled up to the rating. Read out as "4 out of 5".
export default function StarRating({ rating }) {
    return (
        <span className="stars" role="img" aria-label={`${rating} out of 5`}>
            {[1, 2, 3, 4, 5].map((i) => (
                <Icon key={i} name="star" className={i <= rating ? "" : "is-off"} />
            ))}
        </span>
    )
}
