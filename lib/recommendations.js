import { env } from "./env";
import { EXTRA_RECS, recsFor } from "./data/recommendations";

/** Shape returned by GET /api/recommendations and POST /api/recommendations/generate */
export function recsPayload(city, state) {
  const poolLeft = env.aiServiceUrl
    ? null // AI can always produce more
    : EXTRA_RECS.filter((r) => !state.extra.some((e) => e.id === r.id)).length;
  return {
    recs: [...state.extra, ...recsFor(city)],
    skipped: state.skipped,
    poolLeft,
  };
}
