import { Link } from "react-router"
import { PixelStethoscope, PixelMedical, PixelSyringe, PixelScalpel, PixelPill, PixelPaw } from "../components/icons/pixel-icons"
import Button from "../components/ui/Button"
import { getServices } from "../api/services"
import { useEffect, useState } from "react"
import { getGDriveUrl } from "../utils/gdrive"
import { getFAQs } from "../api/misc"

const ServicesPage = () => {

  const [services, setServices] = useState([])
  const [lang, setLang] = useState("en");
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then(data => setServices(data))
      .finally(() => setServicesLoading(false));
  }, [])

  useEffect(() => {
    if (servicesLoading) return;

    const hash = window.location.hash.replace("#", "");
    if (!hash) return;

    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [servicesLoading]);
  
  useEffect(() => {
    const fetchFAQs = async () => {
      setLoading(true);
      try {
        const data = await getFAQs(lang);
        const sorted = [...data].sort((a, b) => a.order - b.order);
        setFaqs(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFAQs();
  }, [lang]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-mc-green-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-mc-primary shadow-mc-flat mb-6">
              <PixelMedical className="w-4 h-4 text-mc-grass" />
              <span className="text-sm font-medium">Our Services</span>
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-foreground mb-6">
              Comprehensive Pet Care
            </h1>
            <p className="text-lg text-muted-foreground">
              From routine check-ups to specialized treatments, we offer a full range of 
              veterinary services to keep your pet healthy and happy throughout their life.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {servicesLoading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className={`scroll-mt-24`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-pulse">
                {/* Image skeleton */}
                <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp aspect-square max-w-md mx-auto">
                    <div className="w-full h-full bg-mc-creeper" />
                  </div>
                </div>

                {/* Content skeleton */}
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""} pt-4`}>
                  {/* Title */}
                  <div className="h-5 bg-mc-creeper rounded w-2/3 mb-6" />
                  {/* Description lines */}
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-mc-creeper rounded w-full" />
                    <div className="h-3 bg-mc-creeper rounded w-5/6" />
                    <div className="h-3 bg-mc-creeper rounded w-4/6" />
                  </div>
                  {/* "What's included" label */}
                  <div className="h-3 bg-mc-creeper rounded w-1/3 mb-4" />
                  {/* Feature items */}
                  <ul className="space-y-3 mb-8">
                    {[...Array(4)].map((_, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-mc-creeper shrink-0" />
                        <div className="h-3 bg-mc-creeper rounded w-3/4" />
                      </li>
                    ))}
                  </ul>
                  {/* Button */}
                  <div className="h-10 bg-mc-creeper rounded w-40" />
                </div>
              </div>

              {index < 2 && (
                <div className="mt-16 border-t-4 border-dashed border-mc-grass" />
              )}
            </div>
          ))
        ) : (
            services.map((service, index) => (
              <div
                key={service.id}
                id={`service-${service.id}`}
                className={`scroll-mt-24 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  {/* Icon Card */}
                  <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                    <div className="bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp p-8 flex flex-col items-center justify-center aspect-square max-w-md mx-auto"> 
                      <img
                          src={getGDriveUrl(service.img_url)}
                          alt={service.title}
                          className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <h2 className="font-pixel text-lg sm:text-xl text-foreground mb-4">
                      {service.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      {service.description}
                    </p>
                    <h4 className="font-medium text-foreground mb-4">What&apos;s Included:</h4>
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-mc-grass flex items-center justify-center shrink-0 mt-0.5">
                            <PixelPaw className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/appointment"
                      >
                      <Button className="text-[10px]">Book This Service</Button>
                    </Link>
                  </div>
                </div>

                {/* Divider */}
                {index < services.length - 1 && (
                  <div className="mt-16 border-t-4 border-dashed border-mc-grass" />
                )}
              </div>
            ))
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-mc-creeper">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-pixel text-lg sm:text-xl text-black mb-4">
              Common Questions
            </h2>
            <p className="text-black mb-5">
              Have questions about our services? Here are some answers.
            </p>

            <div className="inline-flex border-4 border-mc-primary shadow-mc-sharp overflow-hidden">
                <button
                  onClick={() => setLang("en")}
                  className={`font-pixel text-[10px] px-4 py-2 cursor-pointer transition-colors ${
                    lang === "en"
                      ? "bg-mc-grass text-white"
                      : "bg-white text-black hover:bg-mc-creeper"
                  }`}
                >
                  EN
                </button>
                <div className="w-1 bg-mc-creeper" />
                <button
                  onClick={() => setLang("bn")}
                  className={`font-pixel text-[10px] px-4 py-2 cursor-pointer transition-colors ${
                    lang === "bn"
                      ? "bg-mc-grass text-white"
                      : "bg-white text-black hover:bg-mc-creeper"
                  }`}
                >
                  BN
                </button>
              </div>
          </div>

          

          <div className="space-y-4">
            {loading ? (
            // Skeleton placeholders
            [...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white border-4 border-mc-primary shadow-mc-sharp p-6 animate-pulse"
              >
                <div className="h-3 bg-mc-creeper rounded w-3/4 mb-3" />
                <div className="h-2 bg-mc-creeper rounded w-full mb-2" />
                <div className="h-2 bg-mc-creeper rounded w-5/6" />
              </div>
            ))
          ) : faqs.length === 0 ? (
            <div className="bg-white border-4 border-mc-primary shadow-mc-sharp p-6 text-center">
              <p className="font-pixel text-[10px] text-black">No FAQs found.</p>
            </div>
          ) : (
            faqs.map((faq) => {
              const question = lang === "en" ? faq.questionEn : faq.questionBn;
              const answer = lang === "en" ? faq.answerEn : faq.answerBn;

              return (
                <div className="bg-white border-4 border-mc-primary shadow-mc-sharp p-6">
              <h3 className="font-sans font-bold text-xl text-black mb-2">
                {question}
              </h3>
              <p className="text-[16px] text-black">
                {answer}
              </p>
            </div>
              )
            })
          )}
          
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-mc-grass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-pixel text-lg sm:text-xl text-white mb-4">
            Ready to Schedule?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Book an appointment today and let us take care of your beloved companion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/appointment"
            >
              <Button> 
                Book Appointment
              </Button>
            </Link>
            <Link
              to="/contact"
            >
              <Button variant="outline" className="bg-white"> 
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


export default ServicesPage