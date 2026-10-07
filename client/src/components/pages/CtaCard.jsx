import Stamp from "../ui/Stamp"

// Closing call to action: a navy card with a real clinic photo and the stamp
// pressed where the copy meets the photo. `children` are the actions.
export default function CtaCard({ title, text, photo, photoAlt = "", photoPosition, children }) {
    return (
        <section className="cta">
            <div className="wrap">
                <div className="cta-card" data-reveal>
                    <div className="cta-copy">
                        <h2 className="h2">{title}</h2>
                        <p>{text}</p>
                        <div className="cta-actions">{children}</div>
                    </div>
                    <figure className="cta-photo">
                        <img
                            src={photo}
                            alt={photoAlt}
                            loading="lazy"
                            style={photoPosition ? { objectPosition: photoPosition } : undefined}
                        />
                    </figure>
                    <Stamp icon="paw-print" className="cta-stamp" />
                </div>
            </div>
        </section>
    )
}
