import { z } from "zod";
import prisma from "../prismaClient.js";
import { resourceRouter } from "../lib/resourceRouter.js";
import { text, order } from "../lib/http.js";

const schema = z.object({
    questionBn: text(500),
    answerBn: text(),
    questionEn: text(500),
    answerEn: text(),
    order,
});

const router = resourceRouter({
    model: "faq",
    schema,
    orderBy: { order: "asc" },
    orderable: true,
});

// Public FAQs in one language: ?lang=bn, otherwise English.
router.get("/", async (req, res) => {
    const select = req.query.lang === "bn"
        ? { id: true, questionBn: true, answerBn: true }
        : { id: true, questionEn: true, answerEn: true };
    res.set("Cache-Control", "public, max-age=600");
    res.json(await prisma.faq.findMany({ orderBy: { order: "asc" }, select }));
});

export default router;
