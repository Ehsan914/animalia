// The clinic's Google map from the clinic profile. Fills its parent, which must
// be positioned and sized (e.g. .map-frame on the contact page).
export default function ClinicMap({ profile }) {
    return (
        <iframe
            src={profile.mapEmbedUrl}
            title="Map to Animalia Vet Care"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        />
    )
}
