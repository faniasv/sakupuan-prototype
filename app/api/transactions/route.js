import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { CATEGORIES } from "@/lib/categories";
import { db } from "@/lib/db";
import { ACCOUNTS } from "@/lib/data/seed";
import { handler, readBody } from "@/lib/http";
import { buildPeriods, dateLabel, periodKey } from "@/lib/periods";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/transactions[?period=2026-09&account=giro]
//   -> {periods, accounts, transactions}. Filters are optional; the Insight
//      page loads everything once and filters in the browser.
export const GET = handler(async (request) => {
  const user = await requireUser(request);
  const url = new URL(request.url);
  const period = url.searchParams.get("period");
  const account = url.searchParams.get("account");

  const all = await db.listTransactions(user.id);
  const transactions = all.filter(
    (t) => (!period || t.period === period) && (!account || account === "all" || t.account === account),
  );
  return Response.json({
    periods: buildPeriods(all.map((t) => t.period)),
    accounts: ACCOUNTS,
    transactions,
  });
});

const schema = z.object({
  flow: z.enum(["in", "out"]),
  cat: z.string().refine((c) => c in CATEGORIES, "Kategori tidak dikenal"),
  title: z.string().trim().min(1).max(120),
  amount: z.number().int().positive().max(1_000_000_000_000),
  account: z.enum(["tabungan", "giro"]).default("tabungan"),
});

// POST /api/transactions {flow, cat, title, amount, account?} -> 201 {transaction}
export const POST = handler(async (request) => {
  const user = await requireUser(request);
  const body = await readBody(request, schema);
  const now = new Date();
  const transaction = await db.addTransaction(user.id, {
    ...body,
    period: periodKey(now),
    date: dateLabel(now),
    source: "manual",
  });
  return Response.json({ transaction }, { status: 201 });
});
