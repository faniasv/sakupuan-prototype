import crypto from "node:crypto";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { handler, HttpError } from "@/lib/http";
import { fetchDailyPrices } from "@/lib/sp2kp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// GET /api/cron/prices - run daily by Vercel Cron (see vercel.json).
// Vercel sends "Authorization: Bearer $CRON_SECRET". Fails closed without a secret.
export const GET = handler(async (request) => {
  const expected = `Bearer ${env.cronSecret}`;
  const given = request.headers.get("authorization") ?? "";
  const ok =
    env.cronSecret &&
    given.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
  if (!ok) throw new HttpError(401, "Unauthorized");

  const points = await fetchDailyPrices();
  for (const p of points) await db.savePricePoint(p);
  return Response.json({
    updated: points.length,
    note: points.length ? undefined : "No data returned - connect your scraper in lib/sp2kp.js",
  });
});
