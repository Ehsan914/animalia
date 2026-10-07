import { vi } from "vitest";

// Stands in for Cloudflare's siteverify endpoint so tests never reach the
// network: only this token is accepted, and only with the test secret.
export const HUMAN_TOKEN = "human";
export const TURNSTILE_TEST_SECRET = "test-turnstile-secret";

export const siteverify = vi.fn(async (url, { body }) => {
    if (!url.startsWith("https://challenges.cloudflare.com/turnstile/")) {
        throw new Error(`Unexpected fetch in tests: ${url}`);
    }
    const { secret, response } = JSON.parse(body);
    if (secret !== TURNSTILE_TEST_SECRET) {
        return Response.json({ success: false, "error-codes": ["invalid-input-secret"] });
    }
    const success = response === HUMAN_TOKEN;
    return Response.json({ success, "error-codes": success ? [] : ["invalid-input-response"] });
});
