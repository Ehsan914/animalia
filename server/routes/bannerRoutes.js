import { z } from "zod";
import prisma from "../prismaClient.js";
import { resourceRouter } from "../lib/resourceRouter.js";
import { text, optionalText } from "../lib/http.js";

const schema = z.object({
    message: text(500),
    type: z.enum(["info", "promo", "emergency"]).default("promo"),
    ctaLabel: optionalText(100),
    ctaUrl: optionalText(2000),
    active: z.boolean().default(false),
});

const router = resourceRouter({
    model: "banner",
    schema,
    orderBy: { createdAt: "desc" },
    singleLive: true,
});

// Public: the live banner, or null.
router.get("/", async (req, res) => {
    res.set("Cache-Control", "public, max-age=60");
    res.json(await prisma.banner.findFirst({
        where: { active: true },
        orderBy: { createdAt: "desc" },
    }));
});

export default router;
