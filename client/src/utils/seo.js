import { formatPhone } from "./clinicProfile.js";

// Canonical origin for the site (NO trailing slash). Update if the domain changes.
// Page titles and descriptions live in src/routes/publicRoutes.js.
export const SITE_URL = "https://www.animaliavetcare.com";

export const getOgImage = () => {
  return `${SITE_URL}/og-image.png`;
};

export const getCanonicalUrl = (path = "") => {
  const clean = String(path).replace(/^\/+/, "");
  return clean ? `${SITE_URL}/${clean}` : `${SITE_URL}/`;
};

const EVERY_DAY = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Schema.org structured data for the clinic, built from its profile.
export const getLocalBusinessSchema = (profile) => {
  return {
    "@context": "https://schema.org",
    "@type": "VeterinaryClinic",
    name: "Animalia Vet Care",
    description: "Professional veterinary clinic providing compassionate pet care services since 2024. 900+ pets treated by expert veterinarians.",
    url: `${SITE_URL}/`,
    telephone: formatPhone(profile.phone),
    email: profile.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: profile.streetAddress,
      addressLocality: profile.locality,
      addressRegion: "Dhaka",
      postalCode: profile.postalCode,
      addressCountry: "BD",
    },
    founder: {
      "@type": "Person",
      name: "Dr. Md. Easin",
    },
    foundingDate: "2024",
    image: `${SITE_URL}/logo.png`,
    sameAs: profile.facebookUrl ? [profile.facebookUrl] : [],
    knowsAbout: [
      "Pet Health Care",
      "Veterinary Surgery",
      "Pet Vaccinations",
      "Pet Grooming",
      "Emergency Veterinary Care",
      "Pet Diagnostics",
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: EVERY_DAY,
        opens: profile.opensAt,
        closes: profile.closesAt,
      },
      ...(profile.emergency24h ? [{
        "@type": "OpeningHoursSpecification",
        dayOfWeek: EVERY_DAY,
        opens: "00:00",
        closes: "23:59",
        description: "24/7 Emergency services available",
      }] : []),
    ],
  };
};

// Schema for blog post
export const getBlogPostSchema = (blog) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.description || blog.title,
    image: blog.image || `${SITE_URL}/blog-default.jpg`,
    datePublished: blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author || "Animalia Vet Care",
    },
  };
};
