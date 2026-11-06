// Pure scoring logic. Imported by the review/dashboard pages (instant preview)
// AND by POST /api/assessment (the server result is the one that gets saved).

export function calculateScore(answers) {
  const spend = (answers.B1_month_end_money + answers.B2_bills_on_time) / 2;
  const save = (answers.B3_emergency_fund + answers.B4_longterm_confidence) / 2;
  // B5 = 100 ("no debt") -> B6 is skipped (N/A) and counts as 100
  const borrow =
    answers.B5_debt_status === 100
      ? 100
      : (answers.B5_debt_status + answers.B6_credit_history) / 2;
  const plan = (answers.B7_insurance_confidence + answers.B8_future_plan) / 2;

  const totalScore = Math.round((spend + save + borrow + plan) / 4);

  let category = "Hijau";
  let label = "Masak Sultan, Hati Tenang";
  let tagline = "Posisi keuangan Puan udah super stabil!";
  if (totalScore < 40) {
    category = "Merah";
    label = "Mode Siaga Dapur";
    tagline = "Yuk pelan-pelan kita rapiin!";
  } else if (totalScore < 80) {
    category = "Kuning";
    label = "Dapur Aman, Napas Lega";
    tagline = "Tinggal dikit lagi menuju zona nyaman.";
  }

  const pillars = [
    {
      key: "spend",
      name: "Belanja",
      code: "SPEND",
      value: spend,
      praise: "pos belanjamu aman jaya",
      tip: "biar belanja bulanan gak gampang kelepasan, yuk rutin catat sayur & bumbu harian via Telegram!",
    },
    {
      key: "save",
      name: "Tabungan",
      code: "SAVE",
      value: save,
      praise: "tabunganmu udah rajin diisi",
      tip: "biar makin tenang kalau ada keperluan mendadak, yuk pelan-pelan kita isi tabungan daruratnya!",
    },
    {
      key: "borrow",
      name: "Utang",
      code: "BORROW",
      value: borrow,
      praise: "pos utang & cicilanmu aman banget",
      tip: "biar cicilan tetap ringan, yuk catat jatuh temponya biar gak kelewat!",
    },
    {
      key: "plan",
      name: "Rencana",
      code: "PLAN",
      value: plan,
      praise: "rencana masa depanmu udah ada bayangan",
      tip: "biar keluarga makin terlindungi, yuk mulai susun rencana 1–3 tahun bareng Mimin!",
    },
  ];

  const best = pillars.reduce((m, x) => (x.value > m.value ? x : m));
  const weakest = pillars.reduce((m, x) => (x.value < m.value ? x : m));
  const insight = `Keren Puan! ${best.praise.charAt(0).toUpperCase() + best.praise.slice(1)} (${best.value}/100). Nah, ${
    best.key === weakest.key
      ? "yuk pertahankan dengan rutin catat belanja harian via Telegram!"
      : weakest.tip
  }`;

  return { totalScore, spend, save, borrow, plan, category, label, tagline, insight, pillars, best };
}

export const pillarStatus = (v) =>
  v >= 85 ? "Bebas pusing" : v >= 70 ? "Aman jaya" : v >= 50 ? "Udah ada bayangan" : "Perlu disiram dikit";

/** Tailwind classes for the review-page badge. */
export const CATEGORY_STYLES = {
  Hijau: "text-[#1F5932] bg-[#EAF3EC] border-[#B8D8C0]",
  Kuning: "text-[#92400E] bg-[#FEF3C7] border-[#FDE68A]",
  Merah: "text-[#C71C63] bg-[#FFF0F6] border-[#FFC2DC]",
};

/** Short label used on the dashboard score card. */
export const dashboardLabel = (score) =>
  score >= 80 ? "Masak Sultan, Hati Tenang" : score >= 40 ? "Dapur Aman" : "Perlu Perhatian";
