# SEO Implementation Guide for Animalia Vet Care

## Overview
This guide covers essential SEO optimization for your veterinary clinic website to improve search engine visibility and organic traffic.

## 1. Setup Instructions

### Step 1: Install Dependencies
```bash
cd client
npm install react-helmet-async
```

### Step 2: Wrap App with Helmet Provider
Update your `main.jsx` or `App.jsx`:

```jsx
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

function Root() {
  return (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}
```

### Step 3: Update Configuration Files
- Replace `https://www.animaliavetcare.com/` with your actual domain in:
  - `robots.txt`
  - `utils/seo.js`
  - `index.html`

### Step 4: Add OG Image
- Create an OG image (1200x630px recommended)
- Place in `public/og-image.png`
- Update references in code

## 2. Using SEO Component on Each Page

### Homepage Example
```jsx
import { SEO } from '../components/SEO';
import { seoConfig, getLocalBusinessSchema } from '../utils/seo';
import { LocalBusinessSchema } from '../components/SEO';

export default function HomePage() {
  const seoData = seoConfig.home;

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
      />
      <LocalBusinessSchema schema={getLocalBusinessSchema()} />
      {/* Your page content */}
    </>
  );
}
```

### Blog Post Example
```jsx
import { SEO, BlogPostSchema } from '../components/SEO';
import { getBlogPostSchema } from '../utils/seo';

export default function BlogDetailPage({ blog }) {
  const schema = getBlogPostSchema(blog);

  return (
    <>
      <SEO
        title={blog.titleEn}
        description={blog.contentEn.substring(0, 160)}
        keywords={blog.categoryEn}
      />
      <BlogPostSchema schema={schema} />
      {/* Blog content */}
    </>
  );
}
```

## 3. On-Page SEO Best Practices

### Meta Tags Checklist
- ✅ Unique title tags (50-60 characters)
- ✅ Meta descriptions (150-160 characters)
- ✅ Proper heading hierarchy (H1, H2, H3)
- ✅ Open Graph tags
- ✅ Structured data (schema.org)
- ✅ Mobile responsive design (already using Tailwind)
- ✅ Alt text for images
- ✅ Internal links with descriptive anchor text

### URL Structure
- ✅ Blogs use slugs: `/blog/article-title`
- ✅ Services use IDs: `/services` or `/services/:id`
- ✅ Vets use IDs: `/vets` or `/vets/:id`
- **TODO**: Consider slug-based URLs for better SEO

### Content Optimization
- Write descriptive titles and descriptions
- Use keywords naturally in content
- Include internal links between related pages
- Aim for 300+ words per page
- Use header tags properly (one H1 per page)

## 4. Technical SEO

### Speed Optimization
- ✅ Using Vite for fast builds
- ✅ Using Tailwind for optimized CSS
- Use code splitting: `React.lazy()` for routes
- Optimize images with WebP format
- Implement lazy loading for images

### Mobile Optimization
- ✅ Viewport meta tag set
- ✅ Responsive design with Tailwind
- Test on mobile: use Chrome DevTools

### Indexation
- ✅ `robots.txt` configured
- Submit sitemap to Google Search Console
- Use canonical tags (included in SEO component)

## 5. Sitemap Strategy

Create a dynamic sitemap handler. Add to your backend:

```javascript
// server/routes/sitemapRoutes.js
app.get('/sitemap.xml', async (req, res) => {
  const baseUrl = 'https://www.animaliavetcare.com/';
  
  const staticPages = [
    '/about',
    '/services',
    '/vets',
    '/appointments',
    '/blog',
    '/contact',
  ];

  // Get blogs from database
  const blogs = await prisma.blog.findMany({ where: { published: true } });
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Add static pages
  staticPages.forEach(page => {
    xml += `
      <url>
        <loc>${baseUrl}${page}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
    `;
  });

  // Add blog pages
  blogs.forEach(blog => {
    xml += `
      <url>
        <loc>${baseUrl}/blog/${blog.slug}</loc>
        <lastmod>${new Date(blog.createdAt).toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `;
  });

  xml += '</urlset>';
  res.set('Content-Type', 'application/xml');
  res.send(xml);
});
```

## 6. External SEO Strategy

### Content Marketing
- Write regularly on your blog
- Create guides about pet care
- Address common pet health questions
- Use long-tail keywords (e.g., "best vet care for senior dogs")

### Link Building
- Get listed in online vet directories
- Local business listings (Google My Business, Yelp)
- Ask satisfied pet owners for reviews
- Partnership with pet food brands

### Social Media
- Share blog posts on Facebook, Instagram
- Highlight staff and success stories
- Use relevant hashtags

### Local SEO (Important for Vet Clinics!)
- ✅ Set up Google My Business
- ✅ Add consistent NAP (Name, Address, Phone)
- Get local reviews
- Local keyword optimization ("veterinary clinic in [City]")
- Schema markup with address and opening hours

## 7. Monitoring & Analysis

### Tools to Use
- Google Search Console: Monitor indexation & keywords
- Google Analytics: Track traffic & behavior
- Lighthouse: Test page performance
- Screaming Frog: Crawl your site for SEO issues

### Key Metrics to Track
- Organic traffic growth
- Average ranking position
- Click-through rate (CTR)
- Bounce rate
- Pages per session

## 8. Bilingual SEO (for Bengali content)

Since your site is bilingual:
- Use hreflang tags for language alternatives
- Separate meta tags for each language
- Use language attribute on HTML tag
- Create separate URL structures: `/en/` vs `/bn/`

## 9. Quick Wins
1. ✅ Set up Google My Business
2. ✅ Create sitemap
3. ✅ Add robots.txt
4. ✅ Update all meta tags
5. ✅ Add structured data
6. ✅ Submit to Google Search Console
7. Add blog content regularly
8. Get customer reviews
9. Build local citations
10. Optimize page speed

## 10. Long-term SEO Roadmap

**Month 1**: Setup & foundational optimization
- Implement all meta tags
- Add structured data
- Create sitemap
- Setup GSC & Analytics

**Month 2-3**: Content & technical
- Create 10+ blog posts
- Optimize images
- Implement lazy loading
- Monitor rankings

**Month 4+**: Link building & authority
- Guest posts
- Local directory listings
- Review generation
- Social signals

---

**Update all `https://www.animaliavetcare.com/` references with your actual domain!**
