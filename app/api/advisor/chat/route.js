import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { advisorReply } from "@/lib/advisor";
import { callAi } from "@/lib/aiService";
import { DEFAULT_CITY, TASK_CATEGORIES } from "@/lib/constants";
import { handler, readBody } from "@/lib/http";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

const bodySchema = z.object({
  message: z.string().trim().min(1).max(500),
  city: z.string().trim().max(60).default(DEFAULT_CITY),
});
const suggestionSchema = z.object({
  title: z.string().max(160),
  desc: z.string().max(300),
  cat: z.enum(TASK_CATEGORIES),
});

// POST /api/advisor/chat {message, city?} -> {reply, suggestion?, source: "ai" | "rules"}
// Tries the AI service (RAG/LLM) first, otherwise the rule-based fallback.
export const POST = handler(async (request) => {
  const user = await requireUser(request);
  rateLimit(`advisor:${user.id}`, { limit: 20, windowMs: 60_000 });
  const { message, city } = await readBody(request, bodySchema);

  const ai = await callAi("/chat", { message, city, userName: user.name });
  if (typeof ai?.reply === "string" && ai.reply.trim()) {
    const s = suggestionSchema.safeParse(ai.suggestion);
    return Response.json({ reply: ai.reply, suggestion: s.success ? s.data : undefined, source: "ai" });
  }

  const { text, suggestion } = advisorReply(message, city);
  return Response.json({ reply: text, suggestion, source: "rules" });
});
