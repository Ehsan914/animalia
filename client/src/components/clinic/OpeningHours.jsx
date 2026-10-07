import { OPEN_DAYS, openingHours } from "../../utils/clinicProfile"

// Opening hours, plus the emergency line when the clinic answers around the clock.
export default function OpeningHours({ profile }) {
    return (
        <div className="space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-black font-bold">{OPEN_DAYS}</span>
                <span className="font-bold text-black">{openingHours(profile)}</span>
            </div>
            {profile.emergency24h && (
                <div className="flex justify-between text-sm">
                    <span className="text-mc-emergency font-bold">Emergency Services</span>
                    <span className="font-bold text-mc-emergency">24/7 Available</span>
                </div>
            )}
        </div>
    )
}
