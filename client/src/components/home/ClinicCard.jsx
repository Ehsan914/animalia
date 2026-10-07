import Icon from "../ui/Icon"
import { getGDriveUrl } from "../../utils/gdrive"

// "Ekushey Vobon, 677 West Shewrapara" + "Mirpur, Dhaka" → "Ekushey Vobon, Mirpur"
const shortPlace = (profile) =>
    `${profile.streetAddress.split(",")[0]}, ${profile.locality.split(",")[0]}`

const sentence = (text) => (/[.!?]$/.test(text) ? text : `${text}.`)

// The banner window's resting card, shown when no hero banner is live: where the
// clinic is, with a photo from the check-up service.
export default function ClinicCard({ profile, services }) {
    const service = services.find((s) => s.icon_key === "checkup") ?? services[0]
    const photo = service ? getGDriveUrl(service.img_url) : ""

    return (
        <aside className="hero-window" aria-label="News from the clinic">
            <div className="hw-slides">
                <article className="hw-slide hw-slide--clinic is-active" style={{ "--bg": "var(--navy-2)" }}>
                    {photo && (
                        <figure className="hw-media"><img src={photo} alt="" /></figure>
                    )}
                    <div className="hw-body">
                        {profile && (
                            <p className="hw-when"><Icon name="map-pin" />{shortPlace(profile)}</p>
                        )}
                        <h2 className="hw-title">
                            {profile?.landmark ? sentence(profile.landmark) : "Animalia Vet Care"}
                        </h2>
                        {profile?.directionsUrl && (
                            <div className="hw-foot">
                                <a className="text-link" href={profile.directionsUrl} target="_blank" rel="noopener noreferrer">
                                    Directions <Icon name="arrow-up-right" />
                                </a>
                            </div>
                        )}
                    </div>
                </article>
            </div>
        </aside>
    )
}
