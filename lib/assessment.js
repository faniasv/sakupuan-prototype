// Assessment questionnaire definition. Used by the assessment pages (UI),
// by lib/scoring.js and by POST /api/assessment (validation).

export const DEFAULT_ANSWERS = {
  // Part A - profile (not scored)
  A1_sources: ["Gaji/kerja"],
  A2_period: "bulan", // 'minggu' | 'bulan'
  A2_amount: 5500000,
  A3_biggest_expenses: ["Makan & dapur"],
  A3a_food_amount: 2200000,
  A4_city: "Surabaya",

  // SPEND
  B1_month_end_money: 75,
  B1a_remaining_amount: 350000,
  B2_bills_on_time: 100,

  // SAVE
  B3_emergency_fund: 75,
  B4_longterm_confidence: 75,

  // BORROW (100 = no debt -> B6 is skipped and counts as 100)
  B5_debt_status: 75,
  B6_credit_history: 100,

  // PLAN
  B7_insurance_confidence: 75,
  B8_future_plan: 75,
};

export const A1_OPTIONS = ["Gaji/kerja", "Usaha/jualan", "Pasangan/keluarga"];
export const A3_OPTIONS = ["Makan & dapur", "Sekolah anak", "Listrik & air"];

const opts = (...pairs) => pairs.map(([score, text]) => ({ score, text }));

// Scored questions. `key` is the field name inside `answers`.
export const QUESTIONS = {
  B1_month_end_money: {
    text: "Pas hilal akhir bulan muncul, kondisi dompet Puan…",
    options: opts(
      [100, "Masak sultan (Sisa banyak)"],
      [75, "Masih sisa sedikit (Aman jaya)"],
      [50, "Pas-pasan banget"],
      [0, "Kadang kurang / nombok"],
    ),
  },
  B2_bills_on_time: {
    text: "Bulan lalu, tagihan rutin (listrik, sekolah) dibayar tepat waktu?",
    options: opts(
      [100, "Semua tepat waktu"],
      [75, "Hampir semua"],
      [50, "Sebagian"],
      [0, "Nunggak"],
    ),
  },
  B3_emergency_fund: {
    text: "Kalo pemasukan berhenti esok hari, tabungan kamu tahan berapa lama?",
    options: opts(
      [100, "≥ 6 bulan (Penuh ketenangan jiwa)"],
      [75, "3 – 5 bulan (Cukup aman bersandar)"],
      [50, "1 – 2 bulan (Lumayan buat napas)"],
      [0, "< 1 minggu / Gak ada"],
    ),
  },
  B4_longterm_confidence: {
    text: "Seberapa yakin tabungan kamu cukup buat tujuan besar?",
    options: opts([100, "Sangat yakin"], [75, "Yakin aman"], [50, "Agak ragu"], [0, "Gak yakin"]),
  },
  B5_debt_status: {
    text: "Cicilan/utang Puan saat ini (Paylater, Arisan, Pinjol) terasa…",
    options: opts(
      [100, "Bebas utang (Otomatis B6 100)"],
      [75, "Ringan & gak mengganggu dapur"],
      [50, "Sedang (Lumayan kerasa)"],
      [0, "Berat (Napas ngos-ngosan)"],
    ),
  },
  B6_credit_history: {
    text: "Setahun terakhir, pernah telat bayar cicilan / Paylater?",
    options: opts([100, "Tidak pernah"], [75, "Pernah 1x"], [50, "2-3x"], [0, "Sedang menunggak"]),
  },
  B7_insurance_confidence: {
    text: "Seberapa yakin BPJS / Asuransi cukup melindungi keluarga pas sakit?",
    options: opts([100, "Sangat yakin"], [75, "Yakin (BPJS aktif)"], [50, "Takut tombok"], [0, "Gak punya"]),
  },
  B8_future_plan: {
    text: "Aku punya rencana keuangan yang jelas buat 1–3 tahun ke depan.",
    options: opts([100, "Sangat setuju"], [75, "Setuju"], [50, "Ragu-ragu"], [0, "Tidak setuju"]),
  },
};

export const SCORE_KEYS = Object.keys(QUESTIONS);
export const TOTAL_STEPS = 5;
