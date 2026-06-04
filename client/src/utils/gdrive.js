export function getGDriveUrl(url) {
    if (!url) return ""
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
    if (!match) return url
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w400`
}