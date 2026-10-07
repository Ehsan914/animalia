import { PixelMedical } from "../icons/pixel-icons"
import { shortAddress } from "../../utils/clinicProfile"

// The clinic's Google map with a "We are here!" label. Fills its parent, which
// must be positioned (relative) and sized.
export default function ClinicMap({ profile }) {
    return (
        <>
            <iframe
                src={profile.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", inset: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Animalia Vet Care Location"
            />
            <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                <div className="bg-white/90 border-2 border-mc-primary px-3 py-2 text-center shadow-mc-flat">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <PixelMedical className="w-5 h-5 text-primary" />
                        <span className="text-xs text-black font-medium">We are here!</span>
                    </div>
                    <p className="text-xs text-black font-bold max-w-50">
                        {shortAddress(profile)}
                    </p>
                </div>
            </div>
        </>
    )
}
