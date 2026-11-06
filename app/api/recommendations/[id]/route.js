import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getParams, handler, HttpError, readBody } from "@/lib/http";

export const runtime = "nodejs";

// PATCH /api/recommendations/:id {action:"skip"|"undo"} -> {skipped}
// (Approving is just POST /api/tasks with the recommendation's `task`.)
export const PATCH = handler(async (request, ctx) => {
  const user = await requireUser(request);
  const id = Number((await getParams(ctx)).id);
  if (!Number.isInteger(id)) throw new HttpError(400, "ID tidak valid");
  const { action } = await readBody(request, z.object({ action: z.enum(["skip", "undo"]) }));

  const state = await db.getRecState(user.id);
  state.skipped = action === "skip" ? [...new Set([...state.skipped, id])] : state.skipped.filter((x) => x !== id);
  await db.setRecState(user.id, state);
  return Response.json({ skipped: state.skipped });
});
