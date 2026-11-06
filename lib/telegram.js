import { env } from "./env";

const MULT = { rb: 1e3, ribu: 1e3, k: 1e3, jt: 1e6, juta: 1e6 };

// "75rb", "75.000", "1.250.000", "4,5jt", "Rp 85.000"
const AMOUNT_RE = /(?:rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)\s*(rb|ribu|k|jt|juta)?\b/gi;

function toNumber(numStr, unit) {
  const grouped = /^\d{1,3}([.,]\d{3})+$/.test(numStr);
  const n = grouped ? Number(numStr.replace(/[.,]/g, "")) : Number(numStr.replace(",", "."));
  return Math.round(n * (unit ? MULT[unit.toLowerCase()] : 1));
}

const INCOME_WORDS = /\b(gaji|bonus|pemasukan|terima|dapat|jualan|untung|THR|transfer masuk)\b/i;

// First match wins. Keys are CATEGORIES ids from lib/categories.js
const EXPENSE_RULES = [
  [/(pasar|sayur|beras|telur|minyak|belanja|bumbu|cabai|cabe|daging|ayam|ikan|gas)/i, "belanja-dapur"],
  [/(bakso|makan|jajan|kopi|minum|nasi|warung|resto)/i, "makanan"],
  [/(ojol|bensin|parkir|grab|gojek|angkot|tol)/i, "transportasi"],
  [/(listrik|pln|pdam|wifi|pulsa|internet|token|air)/i, "tagihan"],
  [/(spp|sekolah|buku|les)/i, "pendidikan"],
  [/(obat|vitamin|dokter|klinik|bpjs)/i, "kesehatan"],
  [/(top-?up|e-?wallet|ovo|gopay|dana)/i, "top-up"],
  [/(admin|biaya)/i, "biaya"],
  [/(nonton|netflix|game|bioskop)/i, "hiburan"],
];

/**
 * "Beli beras 75rb" -> { flow:'out', cat:'belanja-dapur', amount:75000, title:'Beli beras 75rb' }
 * Returns null when no amount is found.
 */
export function parseTransaction(text) {
  const clean = String(text).trim();
  const matches = [...clean.matchAll(AMOUNT_RE)];
  if (!matches.length) return null;
  const last = matches[matches.length - 1]; // amount is usually written last
  const amount = toNumber(last[1], last[2]);
  if (!amount || amount <= 0) return null;

  const flow = INCOME_WORDS.test(clean) ? "in" : "out";
  let cat;
  if (flow === "in") cat = /gaji/i.test(clean) ? "gaji" : "uang-masuk";
  else cat = EXPENSE_RULES.find(([re]) => re.test(clean))?.[1] ?? "lainnya";

  return { flow, cat, amount, title: clean.charAt(0).toUpperCase() + clean.slice(1) };
}

/** Sends a message through the Bot API. No-op (returns false) without a token. */
export async function sendTelegramMessage(chatId, text) {
  if (!env.telegramBotToken) {
    console.log(`[telegram:dry-run] -> ${chatId}: ${text}`);
    return false;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${env.telegramBotToken}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    return res.ok;
  } catch (err) {
    console.warn("[telegram] sendMessage failed:", err?.message);
    return false;
  }
}
