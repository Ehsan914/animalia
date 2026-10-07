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

// "#rrggbb", or empty for the site's default navy.
const color = z.string().trim()
    .regex(/^(#[0-9a-f]{6})?$/i, "must be a #rrggbb colour or empty")
    .default("");

// The call-to-action link is rendered as an href, so only schemes that cannot
// run script are allowed: http(s), tel, mailto, or a same-site path. A path
// must not start with "//" or "/\" — browsers read both as another host.
const SAFE_LINK = /^(?:https?:\/\/[^\s/\\]|tel:\S|mailto:\S|\/(?![/\\]))\S*$/i;
const link = optionalText(2000)
    .refine((url) => url === "" || SAFE_LINK.test(url), "must be an http(s), tel: or mailto: link, or a path starting with /");

// Admin forms may send numbers as strings; an empty discount means none.
const discount = z.preprocess(
    (value) => (value === "" || value === undefined ? null : value),
    z.coerce.number().int().min(1, "must be 1 to 99").max(99, "must be 1 to 99").nullable(),
);

const schema = z.object({
    title: text(200),
    description: text(2000),
    location: optionalText(300),
    mapUrl: optionalText(2000),
    // Optional: without a photo the banner is drawn from its colour and headline.
    imageUrl: optionalText(2000),
    partnerLogos: logos,
    startDate: day(false),
    endDate: day(true),
    startTime: optionalText(20),
    endTime: optionalText(20),
    bgColor: color,
    ctaLabel: optionalText(60),
    ctaUrl: link,
    displaySeconds: z.coerce.number().int().min(3, "must be 3 to 30").max(30, "must be 3 to 30").default(6),
    discountPercent: discount,
    active: z.boolean().default(false),
}).refine((banner) => banner.endDate >= banner.startDate, {
    message: "must be on or after the start date",
    path: ["endDate"],
});

// Several hero banners can be live at once; the site rotates through them.
const router = resourceRouter({
    model: "heroBanner",
    schema,
    orderBy: { createdAt: "desc" },
});

// The columns the public banner window renders.
const PUBLIC_FIELDS = {
    id: true,
    title: true,
    description: true,
    location: true,
    mapUrl: true,
    imageUrl: true,
    partnerLogos: true,
    startDate: true,
    endDate: true,
    startTime: true,
    endTime: true,
    bgColor: true,
    ctaLabel: true,
    ctaUrl: true,
    displaySeconds: true,
    discountPercent: true,
};

// Public — every hero banner to show right now: active AND not yet ended (end
// date is today or in the future), earliest start first. The start date is
// display-only, so an upcoming campaign shows immediately; it only disappears
// once it has ended.
router.get("/", async (req, res) => {
    res.set("Cache-Control", "public, max-age=60");
    res.json(await prisma.heroBanner.findMany({
        where: { active: true, endDate: { gte: new Date() } },
        orderBy: [{ startDate: "asc" }, { id: "asc" }],
        select: PUBLIC_FIELDS,
    }));
});

export default router;
