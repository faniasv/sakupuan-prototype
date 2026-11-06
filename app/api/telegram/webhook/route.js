import crypto from "node:crypto";
import { CATEGORIES } from "@/lib/categories";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { handler, HttpError } from "@/lib/http";
import { dateLabel, periodKey } from "@/lib/periods";
import { parseTransaction, sendTelegramMessage } from "@/lib/telegram";
import { rp } from "@/lib/format";

export const runtime = "nodejs";

const HELP = [
  "Halo! Mimin Saku Puan Bot siap bantu catat keuangan dapurmu.",
  "",
  'Catat pengeluaran: "Belanja pasar 85.000" atau "Beli beras 75rb"',
  'Catat pemasukan: "Gaji bulanan 4.500.000"',
  "Cek ringkasan: /ringkasan",
].join("\n");

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

async function handleMessage(chatId, text, from) {
  // 1) deep link: /start <token>
  const start = text.match(/^\/start(?:@\w+)?(?:\s+(\S+))?$/i);
  if (start) {
    if (!start[1]) return HELP;
    const user = await db.consumeTelegramLink(start[1], chatId, from?.username);
    return user
      ? `Mantap ${user.name}! Telegram kamu udah resmi terhubung ke Saku Puan. Sekarang tinggal ketik "Beli beras 75rb" langsung kelar dicatat!`
      : "Link-nya sudah kedaluwarsa. Buka lagi halaman Sambungkan Telegram di aplikasi Saku Puan ya.";
  }

  // everything else needs a linked account
  const user = await db.findUserByChat(chatId);
  if (!user) return "Akun Telegram ini belum terhubung. Buka aplikasi Saku Puan > Sambungkan Telegram dulu ya.";

  if (/^\/(help|bantuan)/i.test(text)) return HELP;

  if (/^\/ringkasan/i.test(text)) {
    const key = periodKey();
    const rows = (await db.listTransactions(user.id)).filter((t) => t.period === key);
    const sum = (flow) => rows.filter((t) => t.flow === flow).reduce((s, t) => s + t.amount, 0);
    return `Ringkasan bulan ini:\nPemasukan: ${rp(sum("in"))}\nPengeluaran: ${rp(sum("out"))}\nSelisih: ${rp(sum("in") - sum("out"))}`;
  }

  const parsed = parseTransaction(text);
  if (!parsed) return 'Mimin belum nangkep nominalnya. Coba format: "Beli beras 75rb" atau "Gaji 2.000.000".';

  const now = new Date();
  await db.addTransaction(user.id, {
    flow: parsed.flow,
    cat: parsed.cat,
    title: parsed.title,
    amount: parsed.amount,
    account: "tabungan",
    period: periodKey(now),
    date: dateLabel(now),
    source: "telegram",
  });
  return `Berhasil dicatat! ${parsed.flow === "in" ? "Pemasukan" : "Pengeluaran"} ${rp(parsed.amount)} masuk ke [${CATEGORIES[parsed.cat].label}].`;
}

// POST /api/telegram/webhook - called by Telegram.
// Register once:  https://api.telegram.org/bot<TOKEN>/setWebhook
//   ?url=<APP_URL>/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>
export const POST = handler(async (request) => {
  const secret = env.telegramWebhookSecret;
  if (!secret || !safeEqual(request.headers.get("x-telegram-bot-api-secret-token") ?? "", secret)) {
    throw new HttpError(401, "Unauthorized");
  }
  const update = await request.json().catch(() => null);
  const msg = update?.message;
  if (msg?.text && msg.chat?.id) {
    try {
      const reply = await handleMessage(msg.chat.id, msg.text.trim(), msg.from);
      if (reply) await sendTelegramMessage(msg.chat.id, reply);
    } catch (err) {
      // Always answer 200, otherwise Telegram keeps retrying the same update.
      console.error("[telegram] failed to handle message", err);
    }
  }
  return Response.json({ ok: true });
});
