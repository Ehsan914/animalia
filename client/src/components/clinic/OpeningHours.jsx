// The clinic's hours as one line ("Every day, 10:00 – 21:00"), in the 24-hour
// form the clinic and the design use. The emergency line is shown separately.
export default function OpeningHours({ profile }) {
    return <>Every day, {profile.opensAt} – {profile.closesAt}</>
}
