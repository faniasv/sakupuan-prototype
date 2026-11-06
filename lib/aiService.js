import { env } from "./env";

/**
 * Calls your AI backend (RAG / LLM / ML predictions). Returns parsed JSON,
 * or null when AI_SERVICE_URL is not set or the call fails/times out, so
 * callers can fall back to the rule-based logic.
 *
 * Expected contract (adjust in the two callers if yours differs):
 *   POST {AI_SERVICE_URL}/chat             {message, city, userName}
 *        -> {reply: string, suggestion?: {title, desc, cat}}
 *   POST {AI_SERVICE_URL}/recommendations  {city, score, count}
 *        -> {recs: [{group, tag, impact, title, desc, task:{title,cat,amount,note}}]}
 */
export async function callAi(path, body, { timeoutMs = 8000 } = {}) {
  if (!env.aiServiceUrl) return null;
  try {
    const res = await fetch(`${env.aiServiceUrl}${path}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(env.aiServiceKey ? { authorization: `Bearer ${env.aiServiceKey}` } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn("[ai] call failed, falling back:", err?.message);
    return null;
  }
}
