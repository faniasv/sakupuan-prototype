import crypto from "node:crypto";
import { env } from "./env";

// Stateless signed cookie: base64url(json).hmac. No JWT library needed.
export const SESSION_COOKIE = "sp_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const hmac = (body) => crypto.createHmac("sha256", env.sessionSecret).update(body).digest("base64url");

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${hmac(body)}`;
}

function verify(token) {
  const [body, sig] = String(token).split(".");
  if (!body || !sig) return null;
  const expected = Buffer.from(hmac(body));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return payload.exp > Math.floor(Date.now() / 1000) ? payload : null;
  } catch {
    return null;
  }
}

export function sessionCookie(userId) {
  const token = sign({ uid: userId, exp: Math.floor(Date.now() / 1000) + MAX_AGE });
  return [`${SESSION_COOKIE}=${token}`, "Path=/", "HttpOnly", "SameSite=Lax", `Max-Age=${MAX_AGE}`, env.isProd ? "Secure" : ""]
    .filter(Boolean)
    .join("; ");
}

export const clearSessionCookie = () => `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;

/** Returns the user id stored in the request's session cookie, or null. */
export function readSessionUserId(request) {
  const raw = request.headers.get("cookie") || "";
  const hit = raw.split(/;\s*/).find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  if (!hit) return null;
  return verify(hit.slice(SESSION_COOKIE.length + 1))?.uid ?? null;
}
