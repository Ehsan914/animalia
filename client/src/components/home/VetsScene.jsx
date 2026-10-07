import { Link } from "react-router-dom"
import Icon from "../ui/Icon"

// "Veterinary Consultant & Surgeon" → "Veterinary" / "Consultant & Surgeon", the two
// short lines a name tag has room for.
function TwoLines({ text }) {
    const [first, ...rest] = text.split(" ")
    if (!rest.length) return text
    return <>{first}<br />{rest.join(" ")}</>
}

// The end of the hero: the photo of both vets with their name tags, and the
// "Meet the vets" caption (beside the photo on desktop, under it on phones).
// The tags sit on the faces in the photo: the first vet (by admin order) on the
// left, the second on the right.
export default function VetsScene({ vets }) {
    const pair = vets.length >= 2 ? vets.slice(0, 2) : null
    const names = pair ? `${pair[0].name} and ${pair[1].name}` : "Our vets"
    const tagClass = ["tag-easin", "tag-nafisa"]

    return (
        <>
            <figure className="vets-photo" id="vets">
                {/* Phones get the portrait of the two vets; wider screens the exam-table photo. */}
                <picture>
                    <source media="(max-width: 899px)" srcSet="/images/about-vets.jpg" width="1050" height="1400" />
                    <img src="/images/vets.jpg" width="1448" height="1086" alt={`${names} at the clinic`} />
                </picture>
                {pair?.map((vet, i) => (
                    <span key={vet.id} className={`name-tag ${tagClass[i]}`} data-reveal-late="">
                        <b>{vet.name}</b><span><TwoLines text={vet.designation} /></span>
                    </span>
                ))}
            </figure>

            <div className="stage-caption" data-reveal-late="">
                {pair && (
                    <p className="stage-names" aria-hidden="true">
                        {pair.map((vet) => (
                            <span key={vet.id}><b>{vet.name}</b> <TwoLines text={vet.designation} /></span>
                        ))}
                    </p>
                )}
                <h2 className="stage-title" id="vets-title">Experienced hands.<br />Compassionate care.</h2>
                <p>
                    {names} founded Animalia to create a veterinary clinic where clinical expertise and
                    genuine compassion go hand in hand.
                </p>
                <p>
                    Since 2024, our team has cared for 900+ pets in Mirpur, providing everything from
                    preventive care to diagnosis, treatment, and surgery.
                </p>
                <Link className="text-link" to="/vets">
                    Meet our veterinarians <Icon name="arrow-right" className="icon-arrow" />
                </Link>
            </div>
        </>
    )
}
