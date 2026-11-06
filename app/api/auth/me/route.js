import { getCurrentUser, publicUser } from "@/lib/auth";
import { handler } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/auth/me -> {user} or {user:null}. Never 401: the client uses it to bootstrap.
export const GET = handler(async (request) => {
  const user = await getCurrentUser(request);
  return Response.json({ user: user ? publicUser(user) : null });
});
