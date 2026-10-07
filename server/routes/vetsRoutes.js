import { z } from "zod";
import prisma from "../prismaClient.js";
import { resourceRouter } from "../lib/resourceRouter.js";
import { HttpError, text, optionalText, order } from "../lib/http.js";

const schema = z.object({
    name: text(200),
    degree: text(200),
    designation: text(200),
    short_bio: text(1000),
    bio: text(),
    fun_fact: optionalText(1000),
    img_url: text(2000),
    experience: z.coerce.number().int().min(0).default(0),
    order,
    specialityIds: z.array(z.coerce.number().int().positive()).default([]),
});

// A vet's specialities are replaced wholesale on update. Prisma reports a
// missing connect target as the vet being missing, so unknown ids are caught
// here first.
const toData = async ({ specialityIds, ...vet }, mode) => {
    const unique = [...new Set(specialityIds)];
    if (unique.length) {
        const found = await prisma.speciality.count({ where: { id: { in: unique } } });
        if (found < unique.length) {
            throw new HttpError(422, "specialityIds: a selected speciality no longer exists");
        }
    }
    const ids = unique.map((id) => ({ id }));
    return { ...vet, specialities: mode === "create" ? { connect: ids } : { set: ids } };
};

const include = { specialities: true };

const router = resourceRouter({
    model: "vet",
    schema,
    toData,
    include,
    orderBy: { order: "asc" },
    orderable: true,
});

router.get("/", async (req, res) => {
    res.json(await prisma.vet.findMany({ orderBy: { order: "asc" }, include }));
});

export default router;
