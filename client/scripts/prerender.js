// Build-time prerendering for the public SPA.
//
// After `vite build` produces the client bundle in dist/, this script:
//   1. serves dist/ with Vite's preview server,
//   2. drives each public route with headless Chrome (puppeteer),
//   3. waits for the app's single global prefetch to settle
//      (the `data-app-ready` attribute set by SiteDataContext),
//   4. snapshots the fully-rendered HTML (content + react-helmet meta tags),
//   5. writes it back into dist/ as <route>/index.html.
//
// The result: crawlers and link-preview bots (which don't run JS) receive real
// HTML with correct per-page meta tags, while browsers still hydrate and run
// the normal client-side data flow.
//
// Notes:
//   - Dynamic content (services/vets/blogs) is captured only if VITE_API_URL is
//     reachable during the build. If the API is down, static content + meta tags
//     are still captured and the lists fill in on the client as usual.
//   - `--disable-web-security` lets the headless browser read the API across the
//     localhost preview origin without a CORS preflight rejection.

import { preview } from "vite"
import puppeteer from "puppeteer"
import chromium from "@sparticuz/chromium"
import { fileURLToPath } from "node:url"
import { dirname, resolve, join } from "node:path"
import { mkdirSync, writeFileSync } from "node:fs"

const __dirname = dirname(fileURLToPath(import.meta.url))
const clientRoot = resolve(__dirname, "..")
const distDir = resolve(clientRoot, "dist")
const PORT = 4180

// Public routes to prerender. Keep in sync with public/sitemap.xml.
// Admin routes and dynamic (:slug) routes are intentionally excluded.
const ROUTES = [
  "/",
  "/services",
  "/vets",
  "/blogs",
  "/about",
  "/contact",
  "/appointment",
]

const READY_TIMEOUT = 20000
const NAV_TIMEOUT = 60000

async function run() {
  const server = await preview({
    root: clientRoot,
    preview: { port: PORT, strictPort: true },
  })

  // Vercel's build image lacks the system libraries full Chromium needs, so on
  // serverless we use @sparticuz/chromium (a Chromium that bundles its libs).
  // Locally we use puppeteer's own bundled Chromium. `--disable-web-security`
  // lets the headless browser read the API across the localhost preview origin.
  const onServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME
  const launchOptions = onServerless
    ? {
        args: [...chromium.args, "--disable-web-security"],
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      }
    : {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security"],
      }

  const browser = await puppeteer.launch(launchOptions)

  // Collect every snapshot first, then write — so overwriting dist/index.html
  // mid-crawl can't pollute the SPA fallback used by not-yet-rendered routes.
  const snapshots = []

  try {
    for (const route of ROUTES) {
      const page = await browser.newPage()
      const url = `http://localhost:${PORT}${route}`
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: NAV_TIMEOUT })
        try {
          await page.waitForSelector('html[data-app-ready="true"]', {
            timeout: READY_TIMEOUT,
          })
        } catch {
          console.warn(`  ! ${route}: app-ready signal not seen — snapshotting anyway`)
        }
        // Give react-helmet-async a tick to flush head tags into the DOM.
        await new Promise((r) => setTimeout(r, 300))
        // Assets referenced via import.meta.url resolve to absolute URLs against
        // the preview origin; rewrite them back to root-relative so they work on
        // the production domain.
        const html = (await page.content()).replaceAll(`http://localhost:${PORT}`, "")
        snapshots.push({ route, html })
        console.log(`  ✓ rendered ${route}`)
      } finally {
        await page.close()
      }
    }
  } finally {
    await browser.close()
    await server.httpServer.close()
  }

  for (const { route, html } of snapshots) {
    const outDir = route === "/" ? distDir : join(distDir, route)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, "index.html"), html, "utf8")
  }

  console.log(`\nPrerendered ${snapshots.length} route(s) into dist/.`)
}

run().catch((err) => {
  // Deliberately non-fatal: `vite build` has already produced a working CSR
  // bundle in dist/. If prerendering fails (e.g. Chromium can't launch in the
  // CI/Vercel build image), ship that bundle rather than breaking the deploy —
  // the site falls back to client-side rendering, same as before prerendering
  // existed. Logged loudly so the regression is visible in build output.
  console.error("\n========================================================")
  console.error("PRERENDER FAILED — deploying CSR-only (no static SEO HTML).")
  console.error(err)
  console.error("========================================================\n")
  process.exit(0)
})
