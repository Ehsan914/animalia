/* eslint-disable no-unused-vars */
import { Stethoscope } from "lucide-react"
import { Heart, PixelPaw, PixelMedical, PixelStethoscope, HeartWhite } from "../components/icons/pixel-icons"
import { Link } from "react-router"
import Button from "../components/ui/Button"
import { getGDriveUrl } from "../utils/gdrive"
import Reveal from "../components/ui/Reveal"
import { metadata } from "../components/metadata/aboutmetadata"
import { SEO } from "../components/SEO"
import { seoConfig, getCanonicalUrl, getOgImage } from "../utils/seo"

const values = [
  {
    icon: HeartWhite,
    title: "Compassion",
    description: "We treat every pet as if they were our own, with love and gentle care.",
  },
  {
    icon: Stethoscope,
    title: "Care",
    description: "We provide attentive, personalized care to ensure every pet feels safe, comfortable, and loved.",
  },
  {
    icon: PixelMedical,
    title: "Commitment",
    description: "Building lasting relationships with pet parents through transparency and integrity.",
  },
]

const reasons = [
  "Experienced team of certified veterinarians",
  "State-of-the-art medical equipment",
  "24/7 emergency services available",
  "Affordable and transparent pricing",
  "Comfortable, stress-free environment for pets",
  "Personalized care plans for each patient",
]

const img_url = "https://drive.google.com/file/d/1BZmfJJvVVqKQ9yXmYlfUVgwXmkC8uzR9/view?usp=drive_link"

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title={seoConfig.about.title}
        description={seoConfig.about.description}
        keywords={seoConfig.about.keywords}
        canonicalUrl={getCanonicalUrl("about")}
        ogImage={getOgImage()}
      />
      {/* Hero Section */}
      <section className="bg-mc-green-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-mc-primary shadow-mc-flat mb-6">
              <PixelPaw className="w-4 h-4 text-mc-grass" />
              <span className="text-sm font-medium">About Us</span>
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-foreground mb-6">
              Caring for Pets Since 2024
            </h1>
            <p className="text-lg text-muted-foreground">
              At Animalia Vet Care, we believe every pet deserves the best possible care. 
              Our dedicated team combines expertise with compassion to ensure your furry family members 
              live happy, healthy lives.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Clinic Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image placeholder - pixel art style */}
            <Reveal as="div" className="aspect-square bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp p-4">
              <div className="w-full h-full bg-mc-green-light relative overflow-hidden">
                <img
                  src={getGDriveUrl(img_url)}
                  alt="about_pic"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </Reveal>

            {/* Content */}
            <Reveal as="div" delay={120}>
              <h2 className="font-pixel text-lg sm:text-xl text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2024, Animalia Vet Care started with a simple mission: 
                  to provide compassionate, high-quality veterinary care that every pet deserves. 
                  What began as a small clinic has grown into a trusted healthcare destination for 
                  thousands of pets in our community.
                </p>
                <p>
                  Our founder, Dr. Md. Easin, established this clinic with the belief that 
                  veterinary care should be accessible, affordable, and delivered with genuine 
                  compassion. Today, our team of experienced veterinarians continues to uphold 
                  these values every day.
                </p>
                <p>
                  We've treated over 900 pets and counting, from routine check-ups to 
                  complex surgeries. Our minimal clinic setup reflects 
                  our belief that visiting the vet should be a positive experience for both 
                  pets and their families.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-mc-creeper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <Reveal as="div" className="bg-white border-4 border-mc-primary shadow-mc-sharp p-8">
              <h3 className="font-pixel text-sm sm:text-base text-black mb-4">
                Our Mission
              </h3>
              <p className="text-black">
                To provide exceptional veterinary care through compassion, expertise, and 
                innovation, ensuring every pet lives their healthiest, happiest life while 
                building lasting relationships with the families who love them.
              </p>
            </Reveal>

            {/* Vision */}
            <Reveal as="div" delay={120} className="bg-mc-grass border-4 border-mc-primary shadow-mc-sharp p-8">
              <h3 className="font-pixel text-sm sm:text-base text-white mb-4">
                Our Vision
              </h3>
              <p className="text-white/90">
                To be the most trusted and caring veterinary clinic in our community, 
                recognized for our commitment to excellence, innovative treatments, and 
                the genuine bonds we form with pets and their families.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-mc-green-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="font-pixel text-lg sm:text-xl text-black mb-4">
              Our Values
            </h2>
            <p className="text-black max-w-2xl mx-auto">
              These core values guide everything we do at Animalia Vet Care.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Reveal as="div" key={value.title} delay={index * 80} className="bg-white border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
                <div className="w-12 h-12 bg-mc-grass mx-auto flex items-center justify-center mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-pixel text-[10px] text-black mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-black">
                  {value.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <Reveal as="div">
              <h2 className="font-pixel text-lg sm:text-xl text-foreground mb-6">
                Why Choose Us?
              </h2>
              <p className="text-muted-foreground mb-8">
                We understand that choosing a veterinary clinic is an important decision. 
                Here's why pet parents trust us with their beloved companions:
              </p>
              <ul className="space-y-4">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-mc-grass flex items-center justify-center shrink-0 mt-0.5">
                      <PixelPaw className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-foreground">{reason}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Stats */}
            <Reveal as="div" delay={120} className="grid grid-cols-2 gap-6">
              <div className="bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
                <div className="font-pixel text-2xl sm:text-3xl text-mc-grass mb-2">6+</div>
                <p className="text-sm text-muted-foreground">Years of Experience</p>
              </div>
              <div className="bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
                <div className="font-pixel text-2xl sm:text-3xl text-mc-grass mb-2">900+</div>
                <p className="text-sm text-muted-foreground">Pets Treated</p>
              </div>
              <div className="bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
                <div className="font-pixel text-2xl sm:text-3xl text-mc-grass mb-2">2</div>
                <p className="text-sm text-muted-foreground">Expert Veterinarians</p>
              </div>
              <div className="bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
                <div className="font-pixel text-2xl sm:text-3xl text-mc-grass mb-2">24/7</div>
                <p className="text-sm text-muted-foreground">Emergency Care</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-mc-grass">
        <Reveal as="div" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-pixel text-lg sm:text-xl text-white mb-4">
            Ready to Visit Us?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Book an appointment today and experience the difference compassionate care makes.
          </p>
          <Link
            to="/appointment"
          >
            <Button variant="outline" className="bg-white">
            Book Appointment
            </Button>
          </Link>
        </Reveal>
      </section>
    </div>
  )
}

export default AboutPage;