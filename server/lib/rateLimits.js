import { rateLimit, MemoryStore, MINUTE, HOUR } from "express-rate-limit";
import { HttpError } from "./http.js";

// Counters are kept in memory: one count per visitor IP per server process,
// cleared on restart. Enough for a single Railway instance.
const stores = [];

const limiter = ({ message, ...options }) => {
    const store = new MemoryStore();
    stores.push(store);
    return rateLimit({
        store,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        handler: (req, res, next, { statusCode }) => next(new HttpError(statusCode, message)),
        ...options,
    });
};

// Failed sign-ins only, so the admin is never locked out by logging in.
export const loginLimit = limiter({
    windowMs: 15 * MINUTE,
    limit: 10,
    skipSuccessfulRequests: true,
    message: "Too many failed sign-in attempts. Please wait 15 minutes and try again.",
});

// One counter per form, so leaving a review does not use up booking attempts.
// Mounted before the spam check, so a flood never reaches Cloudflare.
export const formLimit = () => limiter({
    windowMs: HOUR,
    limit: 10,
    message: "Too many submissions from your connection. Please try again in an hour.",
});

// Tests start every case with fresh counters.
export const resetRateLimits = () => Promise.all(stores.map((store) => store.resetAll()));
