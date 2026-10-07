import { z } from "zod";
import prisma from "../prismaClient.js";
import { resourceRouter } from "../lib/resourceRouter.js";
import { text, order } from "../lib/http.js";

const schema = z.object({
    title: text(200),
    short_desc: text(1000),
    description: text(),
    price: z.coerce.number().min(0).default(0),
    img_url: text(2000),
    features: z.array(z.string().trim().min(1)).default([]),
    icon_key: z.string().trim().default("").transform((key) => key || "stethoscope"),
    order,
});

const router = resourceRouter({
    model: "service",
    schema,
    orderBy: { order: "asc" },
    orderable: true,
});

router.get("/", async (req, res) => {
    res.set("Cache-Control", "public, max-age=600");
    res.json(await prisma.service.findMany({ orderBy: { order: "asc" } }));
});

export default router;
