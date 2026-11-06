import { requireUser } from "@/lib/auth";
import { handler } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/telegram/status -> {connected, username}   (the connect page polls this)
export const GET = handler(async (request) => {
  const user = await requireUser(request);
  return Response.json({ connected: !!user.telegramChatId, username: user.telegramUsername || "" });
});
