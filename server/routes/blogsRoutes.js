import { z } from "zod";
import prisma from "../prismaClient.js";
import { resourceRouter } from "../lib/resourceRouter.js";
import { HttpError, text } from "../lib/http.js";

const schema = z.object({
    slug: z.string().trim().toLowerCase()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "use lowercase words joined by hyphens")
        // GET /admin is the admin list, so a post called "admin" could never be read.
        .refine((slug) => slug !== "admin", '"admin" is reserved'),
    titleBn: text(300),
    contentBn: text(100_000),
    categoryBn: text(100),
    titleEn: text(300),
    contentEn: text(100_000),
    categoryEn: text(100),
    author: text(200),
    published: z.boolean().default(false),
});

const router = resourceRouter({
    model: "blog",
    schema,
    key: "slug",
    orderBy: { createdAt: "desc" },
});

// Public posts carry only the requested language: ?lang=bn, otherwise English.
const selectFor = (lang) => ({
    slug: true,
    author: true,
    createdAt: true,
    ...(lang === "bn"
        ? { titleBn: true, contentBn: true, categoryBn: true }
        : { titleEn: true, contentEn: true, categoryEn: true }),
});

router.get("/", async (req, res) => {
    res.json(await prisma.blog.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        select: selectFor(req.query.lang),
    }));
});

router.get("/:slug", async (req, res) => {
    const blog = await prisma.blog.findFirst({
        where: { slug: req.params.slug, published: true },
        select: selectFor(req.query.lang),
    });
    if (!blog) throw new HttpError(404, "Blog not found");
    res.json(blog);
});

export default router;
