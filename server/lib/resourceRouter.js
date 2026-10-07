import express from "express";
import { z } from "zod";
import prisma from "../prismaClient.js";
import auth from "../middleware/auth.js";
import { parseBody, parseId } from "./http.js";

const reorderSchema = z.object({
    items: z.array(z.object({
        id: z.number().int().positive(),
        order: z.number().int().min(1),
    })).min(1),
});

/**
 * Admin CRUD for one Prisma model.
 *
 *   model       Prisma delegate name, e.g. "vet"
 *   schema      zod schema for create and update bodies (PUT is a full replace)
 *   toData      (parsed, "create" | "update") => Prisma data, for relation writes;
 *               may be async and may throw HttpError for invalid references
 *   key         "id" (integer) or another unique column such as "slug"
 *   include     relations returned with every record
 *   orderBy     order of the admin list
 *   orderable   adds PUT /reorder for an `order` column
 *   singleLive  at most one record is `active`; activating one deactivates the rest
 *
 * Mounts GET /admin, POST /, PUT /reorder, PUT /:key and DELETE /:key, all behind
 * auth. Public reads differ per entity, so callers add them to the returned router.
 */
export const resourceRouter = ({
    model,
    schema,
    toData = (data) => data,
    key = "id",
    include,
    orderBy,
    orderable = false,
    singleLive = false,
}) => {
    const router = express.Router();
    const whereKey = (req) => ({ [key]: key === "id" ? parseId(req.params.key) : req.params.key });

    const save = (write) => {
        if (!singleLive) return write(prisma);
        return prisma.$transaction(async (tx) => {
            const record = await write(tx);
            if (record.active) {
                await tx[model].updateMany({
                    where: { id: { not: record.id }, active: true },
                    data: { active: false },
                });
            }
            return record;
        });
    };

    router.get("/admin", auth, async (req, res) => {
        res.set("Cache-Control", "no-store");
        res.json(await prisma[model].findMany({ include, orderBy }));
    });

    router.post("/", auth, async (req, res) => {
        const data = await toData(parseBody(schema, req.body), "create");
        res.status(201).json(await save((db) => db[model].create({ data, include })));
    });

    if (orderable) {
        router.put("/reorder", auth, async (req, res) => {
            const { items } = parseBody(reorderSchema, req.body);
            await prisma.$transaction(items.map(({ id, order }) =>
                prisma[model].update({ where: { id }, data: { order } })
            ));
            res.json({ message: "Order updated" });
        });
    }

    router.put("/:key", auth, async (req, res) => {
        const where = whereKey(req);
        const data = await toData(parseBody(schema, req.body), "update");
        res.json(await save((db) => db[model].update({ where, data, include })));
    });

    router.delete("/:key", auth, async (req, res) => {
        await prisma[model].delete({ where: whereKey(req) });
        res.json({ message: "Deleted" });
    });

    return router;
};
