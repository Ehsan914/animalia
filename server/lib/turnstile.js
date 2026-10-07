import { HttpError } from "./http.js";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const MAX_TOKEN_LENGTH = 2048;
const VERIFY_TIMEOUT_MS = 10_000;
const SERVER_SIDE_ERRORS = new Set(["missing-input-secret", "invalid-input-secret"]);

/**
 * Express middleware for public forms. The body must carry `turnstileToken`,
 * which the Cloudflare Turnstile widget gave the visitor, and Cloudflare must
 * confirm it. A token works once, so the form gets a fresh one per submit.
 *
 * 403 when the token is missing or rejected; 503 when Cloudflare cannot be
 * reached, so nothing is saved unchecked.
 */
export const requireHuman = async (req, res, next) => {
    const token = req.body?.turnstileToken;
    if (typeof token !== "string" || !token || token.length > MAX_TOKEN_LENGTH) {
        throw new HttpError(403, "Please complete the spam check");
    }

    let result;
    try {
        const response = await fetch(SITEVERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: token }),
            signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
        });
        if (!response.ok) throw new Error(`siteverify answered ${response.status}`);
        result = await response.json();
    } catch (err) {
        console.error("Turnstile verification unavailable:", err.message);
        throw new HttpError(503, "Could not run the spam check. Please try again.");
    }

    // A bad or missing secret is our fault, not the visitor's: say so in the
    // log, or every real submission would fail quietly as "spam".
    const codes = result?.["error-codes"] ?? [];
    if (codes.some((code) => SERVER_SIDE_ERRORS.has(code))) {
        console.error("Turnstile is misconfigured (check TURNSTILE_SECRET_KEY):", codes);
        throw new HttpError(503, "Could not run the spam check. Please try again.");
    }
    if (!result?.success) {
        throw new HttpError(403, "The spam check failed. Please try again.");
    }
    next();
};
