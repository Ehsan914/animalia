// Motion is skipped for visitors who ask for less of it, and while the build
// prerenders the page, so a half-finished tween is never baked into the HTML.
export const skipMotion = () =>
    window.__PRERENDER__ === true || window.matchMedia("(prefers-reduced-motion: reduce)").matches
