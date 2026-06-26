import { Helmet } from "react-helmet-async";

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
 * LocalBusiness Schema Component - Add structured data for SEO
 */
export const LocalBusinessSchema = ({ schema }) => {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * BlogPostSchema Component - Add structured data for blog posts
 */
export const BlogPostSchema = ({ schema }) => {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
