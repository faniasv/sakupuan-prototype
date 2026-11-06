// Forecast maths. Pure functions, used by /api/forecast/*.

// ---------- Balance projection ----------
export const HISTORY = [
  { label: "Apr 26", value: 3100000 },
  { label: "Mei 26", value: 3300000 },
  { label: "Jun 26", value: 3250000 },
  { label: "Jul 26", value: 3600000 },
  { label: "Agu 26", value: 3850000 },
  { label: "Sep 26", value: 4000000 },
];
export const FUTURE_LABELS = [
  "Okt 26", "Nov 26", "Des 26", "Jan 27", "Feb 27", "Mar 27",
  "Apr 27", "Mei 27", "Jun 27", "Jul 27", "Agu 27", "Sep 27",
];
const BASE_STEP = 325000; // average money left per month at the moment

// "Hemat dapur" scenario: balance grows linearly to Rp 8.400.000 in month 12
const scenarioAt = (i) => Math.round((4000000 + (4400000 * i) / 12) / 1000) * 1000;

/** TODO: derive HISTORY / BASE_STEP from the user's real transactions. */
export function balanceForecast() {
  const current = HISTORY[HISTORY.length - 1].value;
  return {
    history: HISTORY,
    futureLabels: FUTURE_LABELS,
    base: FUTURE_LABELS.map((_, i) => current + BASE_STEP * (i + 1)),
    scenario: FUTURE_LABELS.map((_, i) => scenarioAt(i + 1)),
    current,
  };
}

// ---------- Food price trend ----------
export const COMMODITIES = [
  { id: "beras", name: "Beras Medium", unit: "kg", color: "#1F5932", base: 14300, drift: 0.012, amp: 0.004, seed: 1, monthlyQty: 20 },
  { id: "cabai", name: "Cabai Merah", unit: "kg", color: "#FF4B93", base: 52000, drift: 0.08, amp: 0.03, seed: 2, monthlyQty: 2 },
  { id: "minyak", name: "Minyak Goreng", unit: "liter", color: "#F59E0B", base: 17800, drift: -0.015, amp: 0.008, seed: 3, monthlyQty: 4 },
];

// The simulated dataset ends on this day (same as the old prototype).
export const DATA_AS_OF = "2026-09-30";

export const publicCommodity = ({ id, name, unit, color, monthlyQty }) => ({ id, name, unit, color, monthlyQty });

/** Deterministic 30-day pattern used until real SP2KP data is available. */
export function simulatedSeries(c) {
  return Array.from({ length: 30 }, (_, t) => {
    const noise = 0.5 * Math.sin(t * 1.3 + c.seed) + 0.5 * Math.sin(t * 0.37 + c.seed * 2);
    return Math.round((c.base * (1 + (c.drift * t) / 29) * (1 + c.amp * noise)) / 50) * 50;
  });
}

/** Least-squares line through the points (x = 0..n-1). */
export function linearRegression(ys) {
  const n = ys.length;
  const xMean = (n - 1) / 2;
  const yMean = ys.reduce((s, y) => s + y, 0) / n;
  const slope =
    ys.reduce((s, y, x) => s + (x - xMean) * (y - yMean), 0) /
    ys.reduce((s, _, x) => s + (x - xMean) ** 2, 0);
  return { slope, intercept: yMean - slope * xMean };
}

/**
 * @param commodityId  one of COMMODITIES[].id
 * @param realSeries   optional array of daily prices (oldest -> newest) from the scraper
 */
export function priceForecast(commodityId, realSeries) {
  const c = COMMODITIES.find((x) => x.id === commodityId);
  if (!c) return null;
  const useReal = Array.isArray(realSeries) && realSeries.length >= 30;
  const actual = useReal ? realSeries.slice(-30) : simulatedSeries(c);
  const { slope, intercept } = linearRegression(actual);
  return {
    commodity: publicCommodity(c),
    actual,
    slope,
    intercept,
    today: actual[actual.length - 1],
    projected: intercept + slope * 59, // 30 days after the last actual point
    asOf: useReal ? new Date().toISOString().slice(0, 10) : DATA_AS_OF,
    source: useReal ? "sp2kp" : "simulated",
  };
}
