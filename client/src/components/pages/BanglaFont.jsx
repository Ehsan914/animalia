import { Helmet } from "react-helmet-async"

// Hind Siliguri for Bangla text, loaded only on pages that show it (FAQ, blog).
export default function BanglaFont() {
    return (
        <Helmet>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600&display=swap"
            />
        </Helmet>
    )
}
