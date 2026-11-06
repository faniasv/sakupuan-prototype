import { db } from "./db";
import { env } from "./env";
import { HttpError } from "./http";
import { readSessionUserId } from "./session";

export { hashPassword, verifyPassword } from "./password";

/** What the browser is allowed to see about a user. */
export const publicUser = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone || "",
  isVerified: true,
  telegramConnected: !!u.telegramChatId,
  telegramUsername: u.telegramUsername || "",
});

/** Session user, or the demo user when DEMO_MODE=true, or null. */
export async function getCurrentUser(request) {
  const uid = readSessionUserId(request);
  const user = uid ? await db.getUser(uid) : null;
  if (user) return user;
  return env.demoMode ? db.getDemoUser() : null;
}

export async function requireUser(request) {
  const user = await getCurrentUser(request);
  if (!user) throw new HttpError(401, "Silakan login dulu");
  return user;
}
