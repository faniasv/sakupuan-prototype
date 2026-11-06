import { z } from "zod";
import { publicUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { handler, HttpError, readBody } from "@/lib/http";
import { hashPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rateLimit";
import { sessionCookie } from "@/lib/session";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(80),
  email: z.string().trim().email("Format email belum benar").max(160),
  password: z.string().min(8, "Kata sandi minimal 8 karakter").max(200),
});

// POST /api/auth/register  {name, email, password} -> 201 {user} + session cookie
export const POST = handler(async (request) => {
  rateLimit(`register:${request.headers.get("x-forwarded-for") ?? "local"}`, { limit: 10, windowMs: 60_000 });
  const body = await readBody(request, schema);
  if (await db.findUserByEmail(body.email)) throw new HttpError(409, "Email sudah terdaftar, silakan login");
  const user = await db.createUser({ name: body.name, email: body.email, passwordHash: hashPassword(body.password) });
  return Response.json({ user: publicUser(user) }, { status: 201, headers: { "Set-Cookie": sessionCookie(user.id) } });
});
