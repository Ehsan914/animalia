// Helper to set common meta tags for different pages
export const seoConfig = {
  home: {
    title: "Animalia Vet Care - Professional Veterinary Services",
    description:
      "Expert veterinary care for your pets. Experienced vets, comprehensive services, and 24/7 emergency support at Animalia Vet Care.",
    keywords:
      "veterinary clinic, pet care, vet services, animal hospital, pet health",
  },
  about: {
    title: "About Us - Animalia Vet Care",
    description:
      "Learn about Animalia Vet Care, founded in 2024 by Dr. Md. Easin. We've treated 900+ pets with compassion and expertise. Meet our team of experienced veterinarians dedicated to your pet's health.",
    keywords: "about veterinary clinic, our story, Dr. Md. Easin, pet care mission, trusted vet team",
  },
  services: {
    title: "Our Services - Animalia Vet Care",
    description:
      "Comprehensive veterinary services including health check-ups, vaccinations, surgeries, deworming, grooming, pet medicines, and advanced diagnostics for dogs, cats, and small animals.",
    keywords: "vet services, pet check-up, vaccinations, surgery, grooming, deworming, pet care, animal hospital",
  },
  vets: {
    title: "Our Veterinarians - Animalia Vet Care",
    description:
      "Meet our team of experienced and qualified veterinarians dedicated to your pet's health.",
    keywords: "veterinarians, pet doctors, vet team",
  },
  appointments: {
    title: "Book an Appointment - Animalia Vet Care",
    description: "Schedule a consultation with our veterinarians. Easy online booking available.",
    keywords: "book appointment, vet consultation, schedule visit",
  },
  blog: {
    title: "Pet Health Blog - Animalia Vet Care",
    description:
      "Read expert articles about pet health, care tips, and wellness advice from our veterinarians.",
    keywords: "pet health, veterinary blog, pet care tips, animal wellness",
  },
  contact: {
    title: "Contact Us - Animalia Vet Care",
    description:
      "Get in touch with us. Visit our clinic or call for emergency veterinary services.",
    keywords: "contact us, vet clinic, emergency vet",
  },
};

export const getOgImage = (path = "") => {
  // Replace with your actual OG image URL
  return `https://www.animaliavetcare.com//og-image.png`;
};

export const getCanonicalUrl = (path = "") => {
  return `https://www.animaliavetcare.com/${path}`;
};

// Schema.org structured data for local business
export const getLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "VeterinaryClinic",
    name: "Animalia Vet Care",
    description: "Professional veterinary clinic providing compassionate pet care services since 2024. 900+ pets treated by expert veterinarians.",
    url: "https://www.animaliavetcare.com/",
    telephone: "+880 1533 829537",
    email: "animaliavetcare25@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "677 West Shewrapara, Ekushey Vobon",
      addressLocality: "Mirpur, Dhaka",
      addressRegion: "Dhaka",
      postalCode: "1216",
      addressCountry: "BD",
    },
    founder: {
      "@type": "Person",
      name: "Dr. Md. Easin",
    },
    foundingDate: "2024",
    image: "https://www.animaliavetcare.com/logo.png",
    sameAs: [
      "https://www.facebook.com/profile.php?id=61588473520737",
    ],
    knowsAbout: [
      "Pet Health Care",
      "Veterinary Surgery",
      "Pet Vaccinations",
      "Pet Grooming",
      "Emergency Veterinary Care",
      "Pet Diagnostics",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "900",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
        description: "24/7 Emergency services available",
      },
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
    image: blog.image || "https://www.animaliavetcare.com//blog-default.jpg",
    datePublished: blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author || "Animalia Vet Care",
    },
  };
};
