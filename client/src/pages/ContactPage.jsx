import { Link } from "react-router"
import { PixelPaw, PixelHeart, WhatsApp } from "../components/icons/pixel-icons"
import { Phone } from "lucide-react"
import Button from "../components/ui/Button"
import Reveal from "../components/ui/Reveal"
import toast from "react-hot-toast"
import { PageSEO, LocalBusinessSchema } from "../components/SEO"
import { buttonClassName } from "../components/ui/buttonClassName"
import ClinicMap from "../components/clinic/ClinicMap"
import OpeningHours from "../components/clinic/OpeningHours"
import { useClinicProfile } from "../context/SiteDataContext"
import { formatPhone, telHref, whatsAppHref, DEFAULT_WHATSAPP_MESSAGE } from "../utils/clinicProfile"

export default function ContactPage() {
  const profile = useClinicProfile()

  return (
    <div className="min-h-screen">
      <PageSEO page="contact" />
      <LocalBusinessSchema />
      {/* Hero Section */}
      <section className="bg-mc-green-light py-12 md:py-16">
        <Reveal as="div" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-mc-primary shadow-mc-flat mb-6 mx-auto">
            <Phone className="w-4 h-4 text-mc-grass" />
            <span className="text-sm font-medium">Contact</span>
          </div>
          <h1 className="font-pixel text-xl sm:text-2xl text-black mb-4">
            Get In Touch
          </h1>
          <p className="text-black">
            Have questions? We'd love to hear from you. Reach out to us through any 
            of the channels below or visit our clinic.
          </p>
        </Reveal>
      </section>

      {/* Contact Info Cards */}
      {profile && (
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <Reveal as="div" className="bg-background border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
              <div className="w-12 h-12 bg-mc-grass mx-auto flex items-center justify-center mb-4">
                <PixelPaw className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-pixel text-[10px] text-black mb-3">Our Location</h3>
              <p className="text-black text-sm leading-loose">
                {profile.streetAddress} <br/>
                {profile.locality} {profile.postalCode}{profile.landmark && ` (${profile.landmark})`}
              </p>
              <a
                href={profile.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm text-mc-grass hover:underline"
              >
                Get Directions →
              </a>
            </Reveal>

            {/* Phone */}
            <Reveal as="div" delay={80} className="bg-background border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
              <div className="w-12 h-12 bg-mc-grass mx-auto flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-pixel text-[10px] text-black mb-3">Phone</h3>
              <p className="text-black text-sm mb-2">
                General Inquiries
              </p>
              <a
                href={telHref(profile.phone)}
                className="text-black font-medium hover:text-primary transition-colors"
              >
                {formatPhone(profile.phone)}
              </a>
              <p className="text-black text-sm mt-4 mb-2">
                Emergency Line
              </p>
              <a
                href={telHref(profile.emergencyPhone)}
                className="text-destructive font-medium"
              >
                {formatPhone(profile.emergencyPhone)}
              </a>
            </Reveal>

            {/* Email */}
            <Reveal as="div" delay={160} className="bg-background border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
              <div className="w-12 h-12 bg-mc-grass mx-auto flex items-center justify-center mb-4">
                <PixelHeart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-pixel text-[10px] text-foreground mb-3">Email</h3>
              <p className="text-black text-sm mb-2">
                General Questions
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="text-foreground font-medium hover:text-primary transition-colors"
              >
                {profile.email}
              </a>
              <p className="text-black text-sm mt-4 mb-2">
                Appointments
              </p>
              <a
                href={`mailto:${profile.email}`}
                className="text-black font-medium hover:text-primary transition-colors"
              >
                {profile.email}
              </a>
            </Reveal>
          </div>
        </div>
      </section>
      )}

      {/* Map Section */}
      {profile && (
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <Reveal as="div" className="aspect-square lg:aspect-auto border-4 border-mc-primary shadow-mc-sharp relative overflow-hidden min-h-75">
              <ClinicMap profile={profile} />
            </Reveal>

            {/* Operating Hours & WhatsApp */}
            <Reveal as="div" delay={120} className="space-y-6">
              {/* Operating Hours */}
              <div className="bg-card border-4 border-mc-primary shadow-mc-sharp p-6">
                <h3 className="font-pixel text-xs text-black mb-4">
                  Operating Hours
                </h3>
                <OpeningHours profile={profile} />
              </div>

              {/* WhatsApp Button */}
              <a
                href={whatsAppHref(profile.whatsappNumber, DEFAULT_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-mc-grass border-4 border-mc-primary shadow-mc-sharp p-6 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
              >
                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <WhatsApp className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <p className="font-pixel text-[10px] text-white mb-1">
                      Chat on WhatsApp
                    </p>
                    <p className="text-sm text-white/80">
                      Quick responses during business hours
                    </p>
                  </div>
                </div>
              </a>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/appointment"
                >
                  <Button className="w-full">
                    Book Visit
                  </Button>
                </Link>
                <a
                  href={telHref(profile.emergencyPhone)}
                  className={buttonClassName("primary", "w-full bg-mc-emergency border-4 border-mc-heart shadow-mc-emergency p-4 text-center")}
                >
                  <p className="font-pixel text-[10px] text-white">Emergency</p>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      )}

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-mc-creeper">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-8">
            <h2 className="font-pixel text-lg text-black mb-4">
              Send Us a Message
            </h2>
            <p className="text-black">
              Have a question that isn't urgent? Fill out the form below and we'll get back to you soon.
            </p>
          </Reveal>

          <Reveal as="div" delay={120} className="bg-white border-4 border-mc-primary shadow-mc-sharp p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 bg-background text-black border-4 border-mc-primary focus:border-primary focus:outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-background text-black border-4 border-mc-primary focus:border-primary focus:outline-none"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-black mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="w-full px-4 py-3 bg-background text-black border-4 border-mc-primary focus:border-primary focus:outline-none"
              placeholder="How can we help?"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full px-4 py-3 bg-background text-black border-4 border-mc-primary focus:border-primary focus:outline-none resize-none"
              placeholder="Tell us more about your inquiry..."
            />
          </div>
          <Button
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!profile}
            onClick={() => {
              const name = document.getElementById("name").value.trim()
              const email = document.getElementById("email").value.trim()
              const subject = document.getElementById("subject").value.trim()
              const message = document.getElementById("message").value.trim()
              if (!name || !email || !subject || !message) {
                toast.error("Please fill in all required fields.")
                return
              }
              const text = `Hello! I contacted you via the website form.\n\n*Name:* ${name}\n*Email:* ${email}\n*Subject:* ${subject}\n*Message:* ${message}`
              window.open(whatsAppHref(profile.whatsappNumber, text), "_blank")

              document.getElementById("name").value = ""
              document.getElementById("email").value = ""
              document.getElementById("subject").value = ""
              document.getElementById("message").value = ""
            }}
          >
            Send Message
          </Button>
        </Reveal>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-12 bg-mc-grass">
        <Reveal as="div" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-pixel text-base text-white mb-4">
            Have Questions?
          </h2>
          <p className="text-white/80 mb-6">
            Check out our services page for common questions about our veterinary care, 
            or reach out to us directly. We're always happy to help!
          </p>
          <Link
            to="/services"
          >
            <Button className="bg-white text-black">
              View Services & FAQ
            </Button>
          </Link>
        </Reveal>
      </section>
    </div>
  )
}
