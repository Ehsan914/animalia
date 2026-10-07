import { z } from "zod";

// An error whose status and message are safe to show the client.
export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

// Route ids are positive integers; "12abc" is rejected rather than read as 12.
export const parseId = (raw) => {
    if (!/^\d+$/.test(String(raw))) throw new HttpError(400, "Invalid ID");
    return Number(raw);
};

// Parses a request body against a zod schema, failing with the first issue.
export const parseBody = (schema, body) => {
    const result = schema.safeParse(body ?? {});
    if (result.success) return result.data;
    const issue = result.error.issues[0];
    const field = issue.path.join(".");
    throw new HttpError(400, field ? `${field}: ${issue.message}` : issue.message);
};

const PRISMA_ERRORS = {
    P2025: (err) => [404, `${err.meta?.modelName ?? "Record"} not found`],
    P2002: () => [409, "A record with that value already exists"],
    P2003: () => [422, "A referenced record does not exist"],
};

// Express 5 forwards rejected async handlers here, so routes just throw.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
    if (err instanceof HttpError) {
        return res.status(err.status).json({ message: err.message });
    }
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Malformed JSON body" });
    }
    // Other body-parser rejections, e.g. 413 for an oversized body.
    if (err.expose && err.status >= 400 && err.status < 500) {
        return res.status(err.status).json({ message: err.message });
    }
    const prismaError = PRISMA_ERRORS[err.code];
    if (prismaError) {
        const [status, message] = prismaError(err);
        return res.status(status).json({ message });
    }
    res.status(500).json({ message: "Server error" });
};

// Shared field schemas.
export const text = (max = 10_000) => z.string().trim().min(1, "is required").max(max);
export const optionalText = (max = 10_000) => z.string().trim().max(max).default("");
export const order = z.coerce.number().int().min(1, "must be 1 or more");
