import { Link, useParams, useSearchParams } from "react-router-dom"
import Icon from "../components/ui/Icon"
import PageHead from "../components/pages/PageHead"
import PostCard from "../components/pages/PostCard"
import BanglaFont from "../components/pages/BanglaFont"
import { excerpt, parseBlocks, postDate, postFields, readLabel } from "../components/pages/blogText"
import NotFoundPage from "./NotFoundPage"
import { localPhone, telHref } from "../utils/clinicProfile"
import { getBlogPostSchema, getCanonicalUrl, getOgImage } from "../utils/seo"
import { useClinicProfile, useSiteData } from "../context/SiteDataContext"
import { SEO, BlogPostSchema } from "../components/SEO"
import "../styles/pages.css"

const MORE_POSTS = 3

// The body is the admin's plain text: rendered block by block as text, never as HTML.
const ArticleBody = ({ content, lang, children }) => (
    <div className="article-body" lang={lang}>
        {parseBlocks(content).map((block, i) => {
            if (block.type === "h2") return <h2 key={i}>{block.text}</h2>
            if (block.type === "ul") return <ul key={i}>{block.items.map((item, j) => <li key={j}>{item}</li>)}</ul>
            return <p key={i}>{block.text}</p>
        })}
        {children}
    </div>
)

const EmergencyAside = ({ profile }) => (
    <aside className="article-aside" aria-label="Emergency line">
        <h2>Worried right now?</h2>
        <p>{profile.emergency24h ? "The emergency line answers 24/7. " : ""}Call before you set off.</p>
        <a className="emergency-link" href={telHref(profile.emergencyPhone)}>
            <span className="dot dot--alert" />{localPhone(profile.emergencyPhone)}
        </a>
    </aside>
)

const BlogDetailPage = () => {
    const { slug } = useParams()
    const [params] = useSearchParams()
    const { blogs } = useSiteData()
    const profile = useClinicProfile()

    // The list already carries every published post's full text, so nothing is fetched here.
    const lang = params.get("lang") === "bn" ? "bn" : "en"
    const posts = blogs[lang] ?? []
    const post = posts.find((p) => p.slug === slug)
    if (!post) return <NotFoundPage />

    const { title, content, category } = postFields(post, lang)
    const description = excerpt(content, 160)
    const more = posts.filter((p) => p !== post).slice(0, MORE_POSTS)
    const allPosts = (
        <Link className="text-link" to={lang === "bn" ? "/blogs?lang=bn" : "/blogs"}>
            All posts <Icon name="arrow-right" className="icon-arrow" />
        </Link>
    )

    return (
        <>
            <SEO
                title={title}
                description={description}
                canonicalUrl={getCanonicalUrl(`blogs/${post.slug}`)}
                ogImage={getOgImage()}
            />
            <BlogPostSchema
                schema={getBlogPostSchema({ title, description, createdAt: post.createdAt, author: post.author, image: getOgImage() })}
            />
            {lang === "bn" && <BanglaFont />}

            <PageHead
                title={title}
                titleClassName="article-title"
                titleLang={lang}
                meta={(
                    <p className="page-meta" lang={lang}>
                        <b>{category}</b>
                        <span>{post.author}</span>
                        <span>{postDate(post.createdAt, lang)}</span>
                        <span>{readLabel(content, lang)}</span>
                    </p>
                )}
            />

            <section className="section">
                <div className="wrap article">
                    <ArticleBody content={content} lang={lang}>
                        {more.length === 0 && <p className="more-link">{allPosts}</p>}
                    </ArticleBody>
                    {profile && <EmergencyAside profile={profile} />}
                </div>
            </section>

            {more.length > 0 && (
                <section className="section section--mist">
                    <div className="wrap">
                        <h2 className="h2 section-title">More from the blog</h2>
                        <ol className={`more-posts${lang === "bn" ? " lang-bn" : ""}`} lang={lang}>
                            {more.map((p) => <li key={p.slug}><PostCard post={p} lang={lang} /></li>)}
                        </ol>
                        <p className="more-link">{allPosts}</p>
                    </div>
                </section>
            )}
        </>
    )
}

export default BlogDetailPage
