import { z } from "zod";

// Lifecycle shared by reviews and appointments. Mirrors the ModerationStatus
// enum in prisma/schema.prisma.
export const STATUSES = ["pending", "approved", "rejected"];
export const statusSchema = z.enum(STATUSES);

// Only an approved review can be public, so any other status hides it.
export const reviewVisibility = ({ status, published }) => ({
    status,
    published: status === "approved" && published === true,
});
