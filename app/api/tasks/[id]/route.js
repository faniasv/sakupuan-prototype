import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { TASK_CATEGORIES } from "@/lib/constants";
import { db } from "@/lib/db";
import { getParams, handler, HttpError, readBody } from "@/lib/http";

export const runtime = "nodejs";

// null clears an optional field (note / amount).
const patchSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  cat: z.enum(TASK_CATEGORIES).optional(),
  done: z.boolean().optional(),
  note: z.string().trim().max(500).nullable().optional(),
  amount: z.number().int().positive().max(1_000_000_000_000).nullable().optional(),
});

const parseId = async (ctx) => {
  const id = Number((await getParams(ctx)).id);
  if (!Number.isInteger(id)) throw new HttpError(400, "ID tidak valid");
  return id;
};

// PATCH /api/tasks/:id {done?, title?, cat?, note?, amount?} -> {task}
export const PATCH = handler(async (request, ctx) => {
  const user = await requireUser(request);
  const id = await parseId(ctx);
  const patch = await readBody(request, patchSchema);
  const task = await db.updateTask(user.id, id, patch);
  if (!task) throw new HttpError(404, "Rencana tidak ditemukan");
  return Response.json({ task });
});

// DELETE /api/tasks/:id -> {ok:true}
export const DELETE = handler(async (request, ctx) => {
  const user = await requireUser(request);
  const id = await parseId(ctx);
  if (!(await db.deleteTask(user.id, id))) throw new HttpError(404, "Rencana tidak ditemukan");
  return Response.json({ ok: true });
});
