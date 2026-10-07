import { useEffect, useRef } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Icon from "../components/ui/Icon"
import Seg from "../components/ui/Seg"
import PageHead from "../components/pages/PageHead"
import CtaCard from "../components/pages/CtaCard"
import PostCard from "../components/pages/PostCard"
import BanglaFont from "../components/pages/BanglaFont"
import useReveal from "../components/pages/useReveal"
import { postFields } from "../components/pages/blogText"
import { useSiteData } from "../context/SiteDataContext"
import { PageSEO } from "../components/SEO"
import "../styles/pages.css"

const ALL = { en: "All", bn: "সব" }

const LANGS = [
    { value: "en", label: "English" },
    { value: "bn", label: <span lang="bn">বাংলা</span> },
]

const EMPTY_COPY = {
    en: {
        title: "The first notes are on their way.",
        text: "Our vets are writing practical guides on vaccines, deworming and everyday care. Until then, ask us anything at the clinic or on WhatsApp.",
    },
    bn: {
        title: "শিগগিরই নতুন লেখা আসছে।",
        text: "আমাদের চিকিৎসকেরা টিকা, কৃমিনাশক ও প্রতিদিনের যত্ন নিয়ে লিখছেন। ততক্ষণ যেকোনো প্রশ্ন ক্লিনিকে এসে বা হোয়াটসঅ্যাপে জিজ্ঞেস করুন।",
    },
}

const NoPosts = ({ lang }) => (
    <div className="posts-empty" lang={lang}>
        <span className="posts-empty-icon"><Icon name="article" /></span>
        <h2 className="h2">{EMPTY_COPY[lang].title}</h2>
        <p>{EMPTY_COPY[lang].text}</p>
        <div className="cta-actions">
            <Link className="btn" to="/appointment">Book a visit <Icon name="arrow-right" className="icon-arrow" /></Link>
            <Link className="text-link" to="/contact">Send a message</Link>
        </div>
    </div>
)

// The new set of cards settles in, in reading order.
const useSettleIn = (listRef, key) => {
    useEffect(() => {
        const list = listRef.current
        if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const animations = [...list.children].map((li, i) => li.animate(
            [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
            { duration: 420, delay: i * 50, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
        ))
        return () => animations.forEach((a) => a.cancel())
    }, [listRef, key])
}

const BlogPage = () => {
    const { blogs } = useSiteData()
    const [params, setParams] = useSearchParams()
    const listRef = useRef(null)

    // Language and category live in the URL (?lang=bn&cat=…), like the demo.
    const lang = params.get("lang") === "bn" ? "bn" : "en"
    const posts = blogs[lang] ?? []
    const categories = [...new Set(posts.map((post) => postFields(post, lang).category))]
    const cat = categories.includes(params.get("cat")) ? params.get("cat") : null
    const shown = cat ? posts.filter((post) => postFields(post, lang).category === cat) : posts
    const hasAnyPosts = blogs.en?.length > 0 || blogs.bn?.length > 0

    const setQuery = (next) => {
        const q = new URLSearchParams()
        if (next.lang === "bn") q.set("lang", "bn")
        if (next.cat) q.set("cat", next.cat)
        setParams(q, { replace: true })
    }

    useReveal(shown.length)
    useSettleIn(listRef, `${lang}|${cat}`)

    return (
        <>
            <PageSEO page="blog" />
            <BanglaFont />
            <PageHead
                title="Pet care notes"
                lede="Practical advice from our vets on health, vaccines and everyday care, in English and Bangla."
            />

            <section className="section">
                <div className="wrap">
                    {hasAnyPosts && (
                        <div className="blog-tools">
                            <div className="blog-cats" role="group" aria-label="Category" lang={lang}>
                                {[null, ...categories].map((c) => (
                                    <button
                                        key={c ?? "all"}
                                        type="button"
                                        className="cat"
                                        aria-pressed={c === cat}
                                        onClick={() => setQuery({ lang, cat: c })}
                                    >
                                        {c ?? ALL[lang]}
                                    </button>
                                ))}
                            </div>
                            <Seg options={LANGS} value={lang} onChange={(next) => setQuery({ lang: next })} label="Language" />
                        </div>
                    )}
                    {shown.length === 0 ? (
                        <NoPosts lang={lang} />
                    ) : (
                        <ol ref={listRef} className={`posts${lang === "bn" ? " lang-bn" : ""}`} aria-live="polite" lang={lang}>
                            {shown.map((post) => (
                                <li key={post.slug}><PostCard post={post} lang={lang} /></li>
                            ))}
                        </ol>
                    )}
                </div>
            </section>

            <CtaCard
                title="Have a question about your pet?"
                text="Ask us in person, or send a message and we will reply on WhatsApp."
                photo="/images/diagnosis.jpg"
                photoAlt="Dr. Md. Easin examining with a diagnostic lamp"
                photoPosition="50% 30%"
            >
                <Link className="btn btn--paper" to="/appointment">
                    Book a visit <Icon name="arrow-right" className="icon-arrow" />
                </Link>
                <Link className="text-link" to="/contact">Send a message</Link>
            </CtaCard>
        </>
    )
}

export default BlogPage
