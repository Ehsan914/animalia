import { Link } from "react-router"
import { PixelPaw, PixelHeart } from "../components/icons/pixel-icons"
import { getGDriveUrl } from "../utils/gdrive"
import Button from "../components/ui/Button"
import Reveal from "../components/ui/Reveal"
import { useSiteData } from "../context/SiteDataContext"

const VetsPage = () => {
  const { vets } = useSiteData()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-mc-green-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-mc-primary shadow-mc-flat mb-6">
              <PixelHeart className="w-4 h-4 text-mc-grass" />
              <span className="text-sm font-medium">Our Team</span>
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-black mb-6">
              Meet Our Veterinarians
            </h1>
            <p className="text-lg text-black">
              Our team of experienced and caring veterinarians is dedicated to providing 
              the best possible care for your beloved pets. Get to know the professionals 
              who will be looking after your furry family members.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vets List */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {vets.map((vet, index) => (
                  <Reveal
                    as="div"
                    key={vet.name}
                    delay={index * 110}
                    className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${
                      index % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Pixel Avatar Card */}
                    <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                      <div className="bg-mc-creeper border-4 border-mc-primary shadow-mc-sharp p-6 flex flex-col items-center">
                        <div className="w-60 h-60 bg-mc-green-light border-2 border-mc-primary shadow-mc-flat mb-6 relative overflow-hidden">
                          <img
                            src={getGDriveUrl(vet.img_url)}
                            alt={vet.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-pixel text-xs text-foreground text-center mb-1">
                          {vet.name}
                        </h3>
                        <p className="text-sm text-black font-medium text-center mb-4">
                          {vet.designation}
                        </p>
                        <div className="text-xs text-black text-center font-bold px-4 py-2 bg-mc-green-light">
                          {vet.experience}+ Years Experience
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`lg:col-span-2 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                      <div className="mb-4">
                        <h2 className="font-pixel text-base sm:text-lg text-foreground mb-2">
                          {vet.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">{vet.degree}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {vet.specialities?.map((specialty) => (
                          <span
                            key={specialty.id}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-mc-green-light text-xs text-foreground"
                          >
                            <PixelPaw className="w-3 h-3 text-mc-grass" />
                            {specialty.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-[18px] text-black mb-6 leading-relaxed">{vet.bio}</p>
                      <div className="bg-mc-green-light border-2 border-mc-primary shadow-mc-flat p-4 flex items-start gap-3">
                        <PixelHeart className="w-5 h-5 text-mc-heart shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[14px] font-bold text-black mb-1">Fun Fact</p>
                          <p className="text-sm text-black">{vet.fun_fact}</p>
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="lg:col-span-3 mt-6 mb-7 border-t-4 border-dashed border-mc-grass" />
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-mc-grass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-pixel text-lg sm:text-xl text-white mb-4">
            Ready to Meet Us?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Schedule an appointment and experience the care and expertise our team provides.
          </p>
          <Link to="/appointment">
            <Button variant="outline" className="bg-white">
              Book Appointment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default VetsPage