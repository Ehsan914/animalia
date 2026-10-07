import { z } from "zod";
import prisma from "../prismaClient.js";
import { resourceRouter } from "../lib/resourceRouter.js";
import { text, optionalText } from "../lib/http.js";

// The clinic operates in Bangladesh (UTC+6). The admin date picker sends plain
// calendar days ("YYYY-MM-DD"), so we anchor them to clinic-local day boundaries
// — not UTC — otherwise a banner reads as starting/ending 6 hours off.
const CLINIC_TZ_OFFSET = "+06:00";

// A calendar day (or full ISO string) as a Date. The end day is inclusive, so
// a bare end date runs to 23:59:59.999 clinic time.
const day = (endOfDay) => z.string().trim().transform((value, ctx) => {
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}${CLINIC_TZ_OFFSET}`
        : value;
    const date = new Date(iso);
    if (isNaN(date.getTime())) {
        ctx.addIssue({ code: "custom", message: "must be a valid date" });
        return z.NEVER;
    }
    return date;
});

// Partner logos arrive as an array or as newline/comma separated text.
const logos = z.union([z.array(z.string()), z.string()]).default([])
    .transform((value) => (Array.isArray(value) ? value : value.split(/[\n,]/))
        .map((url) => url.trim())
        .filter(Boolean));

const schema = z.object({
    title: text(200),
    description: text(2000),
    location: optionalText(300),
    mapUrl: optionalText(2000),
    imageUrl: text(2000),
    partnerLogos: logos,
    startDate: day(false),
    endDate: day(true),
    startTime: optionalText(20),
    endTime: optionalText(20),
    active: z.boolean().default(false),
}).refine((banner) => banner.endDate >= banner.startDate, {
    message: "must be on or after the start date",
    path: ["endDate"],
});

const router = resourceRouter({
    model: "heroBanner",
    schema,
    orderBy: { createdAt: "desc" },
    singleLive: true,
});

// Public — the single hero banner to show right now: active AND not yet ended
// (end date is today or in the future). The start date is display-only, so an
// upcoming campaign shows immediately; it only disappears once it has ended.
router.get("/", async (req, res) => {
    res.set("Cache-Control", "public, max-age=60");
    res.json(await prisma.heroBanner.findFirst({
        where: { active: true, endDate: { gte: new Date() } },
        orderBy: { createdAt: "desc" },
    }));
});

export default router;
