// Writes dist/sitemap.xml from the public route list, after `vite build`.
// Runs separately from prerendering so the sitemap ships even when headless
// Chrome is unavailable.

import { fileURLToPath } from "node:url"
import { dirname, resolve } from "node:path"
import { writeFileSync } from "node:fs"
import { STATIC_ROUTES } from "../src/routes/publicRoutes.js"
import { getCanonicalUrl } from "../src/utils/seo.js"

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist")

const urls = STATIC_ROUTES.map(({ path, changefreq, priority }) => `  <url>
    <loc>${getCanonicalUrl(path)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`

writeFileSync(resolve(distDir, "sitemap.xml"), xml, "utf8")
console.log(`Wrote sitemap.xml with ${STATIC_ROUTES.length} URLs.`)
