import { requireUser } from "@/lib/auth";
import { DEFAULT_CITY } from "@/lib/constants";
import { db } from "@/lib/db";
import { handler } from "@/lib/http";
import { recsPayload } from "@/lib/recommendations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/recommendations?city=Surabaya
//   -> {recs, skipped, poolLeft}   (poolLeft === null means "unlimited", i.e. AI service connected)
export const GET = handler(async (request) => {
  const user = await requireUser(request);
  const city = (new URL(request.url).searchParams.get("city") || DEFAULT_CITY).slice(0, 60);
  return Response.json(recsPayload(city, await db.getRecState(user.id)));
});
