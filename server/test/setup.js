import { beforeEach, vi } from "vitest";
import { TEST_DATABASE_URL } from "./testDatabase.js";
import { siteverify, TURNSTILE_TEST_SECRET } from "./fakeTurnstile.js";
import { resetRateLimits } from "../lib/rateLimits.js";

// Set before app.js and prismaClient.js load; dotenv never overrides these.
process.env.DATABASE_URL = TEST_DATABASE_URL;
process.env.JWT_SECRET = "test-secret";
process.env.TURNSTILE_SECRET_KEY = TURNSTILE_TEST_SECRET;

vi.stubGlobal("fetch", siteverify);

beforeEach(resetRateLimits);
