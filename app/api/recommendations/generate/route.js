import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { callAi } from "@/lib/aiService";
import { TASK_CATEGORIES } from "@/lib/constants";
import { db } from "@/lib/db";
import { EXTRA_RECS, GROUPS } from "@/lib/data/recommendations";
import { handler, HttpError, readBody } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";
import { recsPayload } from "@/lib/recommendations";

export const runtime = "nodejs";

const aiRec = z.object({
  group: z.enum(GROUPS.map((g) => g.id)),
  tag: z.string().max(80),
  impact: z.string().max(80),
  title: z.string().max(200),
  desc: z.string().max(500),
  task: z.object({
    title: z.string().max(160),
    cat: z.enum(TASK_CATEGORIES),
    amount: z.number().int().positive().optional(),
    note: z.string().max(500).optional(),
  }),
});

// POST /api/recommendations/generate {city} -> {recs, skipped, poolLeft, added}
// Asks the AI service for new suggestions; falls back to the built-in pool.
export const POST = handler(async (request) => {
  const user = await requireUser(request);
  rateLimit(`recs:${user.id}`, { limit: 10, windowMs: 60_000 });
  const { city } = await readBody(request, z.object({ city: z.string().trim().min(1).max(60) }));
  const state = await db.getRecState(user.id);

  let batch = [];
  const ai = await callAi("/recommendations", { city, count: 2, userName: user.name });
  if (Array.isArray(ai?.recs)) {
    batch = ai.recs
      .map((r) => aiRec.safeParse(r))
      .filter((r) => r.success)
      .slice(0, 2)
      .map((r) => ({ id: db.newRecId(), ...r.data }));
  }
  if (!batch.length) {
    batch = EXTRA_RECS.filter((r) => !state.extra.some((e) => e.id === r.id)).slice(0, 2);
  }
  if (!batch.length) throw new HttpError(409, "Belum ada saran baru");

  // newest batch on top, in the same order the old prototype used
  state.extra = [...batch].reverse().concat(state.extra);
  await db.setRecState(user.id, state);
  return Response.json({ ...recsPayload(city, state), added: batch.length });
});
