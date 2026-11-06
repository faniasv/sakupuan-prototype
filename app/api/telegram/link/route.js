import { requireUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { db } from "@/lib/db";
import { handler } from "@/lib/http";

export const runtime = "nodejs";

// POST /api/telegram/link -> {deeplink, token, expiresInMinutes}
// The user opens the deeplink, Telegram sends "/start <token>" to the webhook,
// and the webhook binds the chat to this user.
export const POST = handler(async (request) => {
  const user = await requireUser(request);
  const token = await db.createTelegramLink(user.id);
  return Response.json({
    token,
    deeplink: `https://t.me/${env.telegramBotUsername}?start=${token}`,
    expiresInMinutes: 15,
  });
});
