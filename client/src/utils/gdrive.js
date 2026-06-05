const CACHE_TTL = 1000 * 60 * 60 * 4 // 4 hours

export function getGDriveUrl(url) {
    if (!url) return ""
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (!match) return url

    const id = match[1]
    const cacheKey = `gdrive_${id}`
    const cached = localStorage.getItem(cacheKey)

    if (cached) {
        const { resolvedUrl, expires } = JSON.parse(cached)
        if (Date.now() < expires) return resolvedUrl
    }

    const resolvedUrl = `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
    localStorage.setItem(cacheKey, JSON.stringify({
        resolvedUrl,
        expires: Date.now() + CACHE_TTL
    }))

    return resolvedUrl
}