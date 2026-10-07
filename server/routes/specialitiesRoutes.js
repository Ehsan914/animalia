import { z } from "zod";
import prisma from "../prismaClient.js";
import { resourceRouter } from "../lib/resourceRouter.js";
import { text } from "../lib/http.js";

const router = resourceRouter({
    model: "speciality",
    schema: z.object({ name: text(100) }),
    orderBy: { name: "asc" },
});

router.get("/", async (req, res) => {
    res.json(await prisma.speciality.findMany({ orderBy: { name: "asc" } }));
});

export default router;
