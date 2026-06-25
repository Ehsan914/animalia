import { Link } from "react-router"
import { PixelPaw } from "../components/icons/pixel-icons"
import Button from "../components/ui/Button"
import Reveal from "../components/ui/Reveal"
import { useState } from "react"
import { useSiteData } from "../context/SiteDataContext"

const categories = [
  { name: "All", slug: "all" },
  { name: "Pet Care", slug: "pet-care" },
  { name: "Nutrition", slug: "nutrition" },
  { name: "Vaccination", slug: "vaccination" },
  { name: "Surgery", slug: "surgery" },
]

const NoBlogsFound = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 gap-4">
    <div className="border-4 border-mc-primary shadow-mc-sharp bg-white p-8 flex flex-col items-center gap-4 max-w-sm w-full">
      <PixelPaw className="w-16 h-16 text-mc-primary/30" />
      <p className="font-pixel text-[10px] text-black text-center">No blogs yet</p>
      <p className="text-sm text-black text-center">
        Check back soon — our vets are busy writing!
      </p>
    </div>
  </div>
)

const BlogPage = () => {
  const { blogs } = useSiteData()
  const [lang, setLang] = useState("en")
  const blogPosts = blogs[lang] ?? []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-mc-green-light py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-mc-primary shadow-mc-flat mb-6">
              <PixelPaw className="w-4 h-4 text-mc-grass" />
              <span className="text-sm font-medium">Blog</span>
            </div>
            <h1 className="font-pixel text-xl sm:text-2xl md:text-3xl text-black mb-6">
              Pet Care Tips & Advice
            </h1>
            <p className="text-lg text-black">
              Expert insights from our veterinary team to help you provide the best care
              for your beloved pets. Browse our articles on health, nutrition, and more.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 bg-white border-b-4 border-mc-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category buttons */}
            <div className="flex flex-wrap gap-2 flex-1">
              {categories.map((category, index) => (
                <button
                  key={category.slug}
                  className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    index === 0
                      ? "bg-mc-grass text-white"
                      : "bg-mc-green-light text-black hover:bg-mc-creeper"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Lang toggle — right end */}
            <div className="inline-flex border-4 border-mc-primary shadow-mc-sharp overflow-hidden ml-auto">
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
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24 bg-mc-creeper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.length === 0
              ? <NoBlogsFound />
              : blogPosts.map((post, index) => (
                  <Reveal
                    as={Link}
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    delay={Math.min(index, 9) * 60}
                    className="group bg-white border-4 border-mc-primary shadow-mc-sharp overflow-hidden hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-mc-green-light relative overflow-hidden">
                      <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
                        {Array.from({ length: 48 }).map((_, i) => (
                          <div
                            key={i}
                            className={`${
                              (i + Math.floor(i / 8)) % 2 === 0
                                ? "bg-mc-green-light"
                                : "bg-mc-green-light/70"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute top-3 left-3 px-3 py-1 bg-mc-grass text-white text-xs font-medium">
                        {lang === "en" ? post.categoryEn : post.categoryBn}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PixelPaw className="w-16 h-16 text-mc-primary/30" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center gap-3 text-xs text-black mb-2">
                        <span>{new Date(post.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "bn-BD", { year: "numeric", month: "long", day: "numeric" })}</span>
                        <span>•</span>
                        <span>{post.author}</span>
                      </div>
                      <h2 className="font-pixel text-[10px] sm:text-xs text-black mb-2 group-hover:text-mc-grass transition-colors">
                        {lang === "en" ? post.titleEn : post.titleBn}
                      </h2>
                      <p className="text-sm text-black line-clamp-2">
                        {lang === "en" ? post.contentEn : post.contentBn}
                      </p>
                      <span className="inline-block mt-4 text-sm text-mc-grass font-medium group-hover:underline">
                        Read more →
                      </span>
                    </div>
                  </Reveal>
                ))
            }
          </div>

          {/* Load More */}
          {blogPosts.length > 0 && (
            <div className="text-center mt-12">
              <Button>Load More Posts</Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-mc-grass">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-pixel text-lg sm:text-xl text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-white/80 mb-8">
            Subscribe to our newsletter for the latest pet care tips and clinic updates.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="grow px-4 py-3 bg-white text-foreground border-4 border-mc-primary/30 focus:border-primary focus:outline-none"
            />
            <Button
              className="px-6 py-3 bg-white text-black font-pixel text-[10px]"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default BlogPage