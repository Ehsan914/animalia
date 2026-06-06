import { Link } from "react-router"
import { PixelPaw, PixelMedical, PixelHeart, WhatsApp } from "../components/icons/pixel-icons"
import { Phone } from "lucide-react"
import Button from "../components/ui/Button"
import toast from "react-hot-toast"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-mc-green-light py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 md:py-16 bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <div className="bg-background border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
              <div className="w-12 h-12 bg-mc-grass mx-auto flex items-center justify-center mb-4">
                <PixelPaw className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-pixel text-[10px] text-black mb-3">Our Location</h3>
              <p className="text-black text-sm leading-loose">
                Ekushey Vobon, 677 West Shewrapara <br/>
                Mirpur, Dhaka 1216 (Beside Shewrapara Metro Station)
              </p>
              <a
                href="https://maps.app.goo.gl/VyPFrAJ5fpv2Ghvd7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 text-sm text-mc-grass hover:underline"
              >
                Get Directions →
              </a>
            </div>

            {/* Phone */}
            <div className="bg-background border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
              <div className="w-12 h-12 bg-mc-grass mx-auto flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-pixel text-[10px] text-black mb-3">Phone</h3>
              <p className="text-black text-sm mb-2">
                General Inquiries
              </p>
              <a
                href="tel:+15551234567"
                className="text-black font-medium hover:text-primary transition-colors"
              >
                +880 1533 829537
              </a>
              <p className="text-black text-sm mt-4 mb-2">
                Emergency Line
              </p>
              <a
                href="tel:+8801879388068"
                className="text-destructive font-medium"
              >
                +880 1879 388068
              </a>
            </div>

            {/* Email */}
            <div className="bg-background border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
              <div className="w-12 h-12 bg-mc-grass mx-auto flex items-center justify-center mb-4">
                <PixelHeart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-pixel text-[10px] text-foreground mb-3">Email</h3>
              <p className="text-black text-sm mb-2">
                General Questions
              </p>
              <a
                href="mailto:animaliavetcare25@gmail.com"
                className="text-foreground font-medium hover:text-primary transition-colors"
              >
                animaliavetcare25@gmail.com
              </a>
              <p className="text-black text-sm mt-4 mb-2">
                Appointments
              </p>
              <a
                href="mailto:animaliavetcare25@gmail.com"
                className="text-black font-medium hover:text-primary transition-colors"
              >
                animaliavetcare25@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Placeholder */}
            <div className="aspect-square lg:aspect-auto border-4 border-mc-primary shadow-mc-sharp relative overflow-hidden min-h-75">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.7949602483322!2d90.3747017!3d23.7903147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c10059bd215d%3A0xb58f1a635614a2ad!2sAnimalia%20Vet%20Care!5e0!3m2!1sen!2sbd!4v1780767823840!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Animalia Vet Care Location"
              />
              {/* Overlay label */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
                <div className="bg-white/90 border-2 border-mc-primary px-3 py-2 text-center shadow-mc-flat">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <PixelMedical className="w-5 h-5 text-primary" />
                    <span className="text-xs text-black font-medium">We are here!</span>
                  </div>
                  <p className="text-xs text-black font-bold max-w-50">
                    677 West Shewrapara, Mirpur, Dhaka 1216
                  </p>
                </div>
              </div>
            </div>

            {/* Operating Hours & WhatsApp */}
            <div className="space-y-6">
              {/* Operating Hours */}
              <div className="bg-card border-4 border-mc-primary shadow-mc-sharp p-6">
                <h3 className="font-pixel text-xs text-black mb-4">
                  Operating Hours
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-black">Saturday - Friday</span>
                    <span className="font-medium text-black">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-mc-emergency font-medium">Emergency Services</span>
                    <span className="font-medium text-mc-emergency">24/7 Available</span>
                  </div>
                  
                </div>
              </div>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/1879388068?text=Hi!%20I%20would%20like%20to%20inquire%20about%20your%20veterinary%20services."
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
                  href="tel:+8801879388068"
                  className="bg-mc-emergency border-4 border-mc-heart shadow-mc-emergency p-4 text-center hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <p className="font-pixel text-[10px] text-white">
                    Emergency
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-12 md:py-16 bg-mc-creeper">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-pixel text-lg text-black mb-4">
              Send Us a Message
            </h2>
            <p className="text-black">
              Have a question that isn't urgent? Fill out the form below and we'll get back to you soon.
            </p>
          </div>

          <div className="bg-white border-4 border-mc-primary shadow-mc-sharp p-6 space-y-6">
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
            className="w-full"
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
              const encoded = encodeURIComponent(text)
              window.open(`https://wa.me/8801879388068?text=${encoded}`, "_blank")

              document.getElementById("name").value = ""
              document.getElementById("email").value = ""
              document.getElementById("subject").value = ""
              document.getElementById("message").value = ""
            }}
          >
            Send Message
          </Button>
        </div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-12 bg-mc-grass">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
        </div>
      </section>
    </div>
  )
}
