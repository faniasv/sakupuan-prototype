import { requireUser } from "@/lib/auth";
import { balanceForecast } from "@/lib/forecast";
import { handler } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/forecast/balance
//   -> {history, futureLabels, base[12], scenario[12], current}
// TODO: compute from the user's transactions / the ML-prediction service.
export const GET = handler(async (request) => {
  await requireUser(request);
  return Response.json(balanceForecast());
});
