// Month/period helpers. Everything is formatted in Asia/Jakarta so a
// transaction logged at 01:00 WIB on the 1st lands in the right month even
// when the server runs in UTC (Vercel).

const TZ = "Asia/Jakarta";

export function periodKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit" }).formatToParts(date);
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get("year")}-${get("month")}`;
}

/** "12 Sep 2026" */
export const dateLabel = (date = new Date()) =>
  date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: TZ });

const utcLabel = (d) =>
  d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** "2026-09" -> "1 Sep 2026 - 30 Sep 2026" */
export function periodLabel(key) {
  const [y, m] = key.split("-").map(Number);
  return `${utcLabel(new Date(Date.UTC(y, m - 1, 1, 12)))} - ${utcLabel(new Date(Date.UTC(y, m, 0, 12)))}`;
}

/** Unique, ascending list of { key, label } for the given period keys. */
export const buildPeriods = (keys) =>
  [...new Set(keys)].sort().map((key) => ({ key, label: periodLabel(key) }));
