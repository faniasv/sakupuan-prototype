import { z } from "zod";
import { publicUser, requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { handler, HttpError, readBody } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Same rules as the old ProfileModal form.
const schema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(80),
  email: z.string().trim().email("Format email belum benar"),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || /^(\+62|62|0)8\d{7,11}$/.test(v.replace(/[\s-]/g, "")), "Contoh: 0812 3456 7890"),
});

// GET /api/profile -> {user}
export const GET = handler(async (request) => {
  return Response.json({ user: publicUser(await requireUser(request)) });
});

// PATCH /api/profile {name, email, phone} -> {user}
export const PATCH = handler(async (request) => {
  const me = await requireUser(request);
  const body = await readBody(request, schema);
  const clash = await db.findUserByEmail(body.email);
  if (clash && clash.id !== me.id) throw new HttpError(409, "Email sudah dipakai akun lain");
  const updated = await db.updateUser(me.id, { name: body.name, email: body.email.toLowerCase(), phone: body.phone });
  return Response.json({ user: publicUser(updated) });
});
