import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { A1_OPTIONS, A3_OPTIONS, SCORE_KEYS } from "@/lib/assessment";
import { handler, readBody } from "@/lib/http";
import { calculateScore } from "@/lib/scoring";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const point = z.number().int().refine((n) => [0, 25, 50, 75, 100].includes(n), "Skor harus 0/25/50/75/100");
const money = z.number().int().min(0).max(1_000_000_000_000);

const answersSchema = z.object({
  A1_sources: z.array(z.enum(A1_OPTIONS)),
  A2_period: z.enum(["minggu", "bulan"]),
  A2_amount: money,
  A3_biggest_expenses: z.array(z.enum(A3_OPTIONS)),
  A3a_food_amount: money,
  A4_city: z.string().trim().min(1, "Kota wajib diisi").max(60),
  B1a_remaining_amount: money,
  ...Object.fromEntries(SCORE_KEYS.map((k) => [k, point])),
});

// GET /api/assessment -> {assessment: {answers, score, createdAt} | null}
export const GET = handler(async (request) => {
  const user = await requireUser(request);
  return Response.json({ assessment: await db.getAssessment(user.id) });
});

// POST /api/assessment {answers} -> {score, assessment}. The server recomputes the score.
export const POST = handler(async (request) => {
  const user = await requireUser(request);
  const { answers } = await readBody(request, z.object({ answers: answersSchema }));
  const score = calculateScore(answers);
  const assessment = await db.saveAssessment(user.id, { answers, score });
  return Response.json({ score, assessment });
});
