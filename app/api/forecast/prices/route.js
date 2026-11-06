import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { COMMODITIES, priceForecast, publicCommodity } from "@/lib/forecast";
import { handler, HttpError } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/forecast/prices?commodity=cabai&city=Surabaya
//   -> {commodities, series:{commodity, actual[30], slope, intercept, today, projected, asOf, source}}
// `source` is "sp2kp" once the cron job has stored real data, else "simulated".
export const GET = handler(async (request) => {
  await requireUser(request);
  const url = new URL(request.url);
  const commodityId = url.searchParams.get("commodity") ?? "cabai";
  const city = (url.searchParams.get("city") ?? "Surabaya").slice(0, 60);

  const real = await db.getPriceSeries(city, commodityId);
  const series = priceForecast(commodityId, real);
  if (!series) throw new HttpError(404, "Komoditas tidak ditemukan");
  return Response.json({ commodities: COMMODITIES.map(publicCommodity), series });
});
