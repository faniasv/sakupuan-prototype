import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { TASK_CATEGORIES } from "@/lib/constants";
import { db } from "@/lib/db";
import { handler, readBody } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const taskSchema = z.object({
  title: z.string().trim().min(1, "Nama rencana wajib diisi").max(160),
  cat: z.enum(TASK_CATEGORIES),
  note: z.string().trim().max(500).optional(),
  amount: z.number().int().positive().max(1_000_000_000_000).optional(),
});

// GET /api/tasks -> {tasks}
export const GET = handler(async (request) => {
  const user = await requireUser(request);
  return Response.json({ tasks: await db.listTasks(user.id) });
});

// POST /api/tasks {title, cat, note?, amount?} -> 201 {task} (200 if the title already exists)
export const POST = handler(async (request) => {
  const user = await requireUser(request);
  const body = await readBody(request, taskSchema);
  const { task, created } = await db.createTask(user.id, body);
  return Response.json({ task }, { status: created ? 201 : 200 });
});
