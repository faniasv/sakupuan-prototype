// Number formatting helpers shared by pages and API responses.

/** 1250000 -> "Rp 1.250.000" (negatives keep the sign in front). */
export const rp = (n) =>
  `${n < 0 ? "-" : ""}Rp ${Math.round(Math.abs(n)).toLocaleString("id-ID")}`;

/** 4000000 -> "4jt" */
export const jt = (n) =>
  `${(n / 1e6).toLocaleString("id-ID", { maximumFractionDigits: 1 })}jt`;

/** 52000 -> "52rb" */
export const rb = (n) =>
  `${(n / 1e3).toLocaleString("id-ID", { maximumFractionDigits: 1 })}rb`;

/** 12.345 -> "12,3" */
export const pctLabel = (n) =>
  n.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
