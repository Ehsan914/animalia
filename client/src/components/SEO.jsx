import { Helmet } from "react-helmet-async";
import { routeFor } from "../routes/publicRoutes";
import { getCanonicalUrl, getOgImage, getLocalBusinessSchema } from "../utils/seo";
import { useClinicProfile } from "../context/SiteDataContext";

/**
 * SEO Component - Manages meta tags for each page
 * Usage: <SEO title="Page Title" description="..." keywords="..." />
 */
export const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  canonicalUrl,
  children,
}) => {
  const siteTitle = "Animalia Vet Care";
  // Avoid duplicating the brand when a page title already contains it.
  const fullTitle = !title
    ? siteTitle
    : title.includes(siteTitle)
      ? title
      : `${title} | ${siteTitle}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph Tags */}
      <meta property="og:title" content={title || siteTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {children}
    </Helmet>
  );
};

/**
 * Meta tags for a public page, from its entry in src/routes/publicRoutes.js.
 * Usage: <PageSEO page="contact" />
 */
export const PageSEO = ({ page }) => {
  const route = routeFor(page);
  return (
    <SEO
      title={route.title}
      description={route.description}
      keywords={route.keywords}
      canonicalUrl={getCanonicalUrl(route.path)}
      ogImage={getOgImage()}
    />
  );
};

// Prerendering writes script text into the HTML as-is, so "<" is escaped to
// keep a "</script>" inside the data from closing the tag.
const toJsonLd = (data) => JSON.stringify(data).replace(/</g, "\\u003c");

/**
 * LocalBusiness structured data, built from the clinic profile.
 */
export const LocalBusinessSchema = () => {
  const profile = useClinicProfile();
  if (!profile) return null;
  return (
    <Helmet>
      <script type="application/ld+json">{toJsonLd(getLocalBusinessSchema(profile))}</script>
    </Helmet>
  );
};

/**
 * BlogPostSchema Component - Add structured data for blog posts
 */
export const BlogPostSchema = ({ schema }) => {
  return (
    <Helmet>
      <script type="application/ld+json">{toJsonLd(schema)}</script>
    </Helmet>
  );
};
