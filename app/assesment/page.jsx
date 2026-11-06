"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "../components/ui/Icons";

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Step 1 - 5

  // State Jawaban Sesuai Spesifikasi
  const [answers, setAnswers] = useState({
    // Bagian A — Profil (Tidak diskor)
    A1_sources: ["Gaji/kerja"],
    A2_period: "bulan", // 'minggu' | 'bulan'
    A2_amount: 5500000,
    A3_biggest_expenses: ["Makan & dapur"],
    A3a_food_amount: 2200000,
    A4_city: "Surabaya",

    // Bagian B — SPEND
    B1_month_end_money: 75, // 100, 75, 50, 25, 0
    B1a_remaining_amount: 350000,
    B2_bills_on_time: 100,

    // Bagian B — SAVE
    B3_emergency_fund: 75,
    B4_longterm_confidence: 75,

    // Bagian B — BORROW
    B5_debt_status: 75, // 100 = Tidak punya utang (B6 N/A)
    B6_credit_history: 100,

    // Bagian B — PLAN
    B7_insurance_confidence: 75,
    B8_future_plan: 75,
  });

  // Toggle pilihan multi-select
  const toggleMultiSelect = (field, option) => {
    setAnswers((prev) => {
      const current = prev[field];
      if (current.includes(option)) {
        return { ...prev, [field]: current.filter((item) => item !== option) };
      } else {
        return { ...prev, [field]: [...current, option] };
      }
    });
  };

  // Rumus Perhitungan Skor Otomatis
  const handleCalculateAndFinish = () => {
    const spend = (answers.B1_month_end_money + answers.B2_bills_on_time) / 2;
    const save = (answers.B3_emergency_fund + answers.B4_longterm_confidence) / 2;

    // Jika B5 = 100 (Tidak punya utang), B6 N/A & tidak dihitung
    const borrow =
      answers.B5_debt_status === 100
        ? 100
        : (answers.B5_debt_status + answers.B6_credit_history) / 2;

    const plan = (answers.B7_insurance_confidence + answers.B8_future_plan) / 2;

    const totalScore = Math.round((spend + save + borrow + plan) / 4);

    let category = "Hijau";
    let label = "Masak Sultan, Hati Tenang";
    if (totalScore < 40) {
      category = "Merah";
      label = "Mode Siaga Dapur";
    } else if (totalScore < 80) {
      category = "Kuning";
      label = "Dapur Aman, Napas Lega";
    }

    const resultData = {
      totalScore,
      category,
      label,
      pillars: { spend, save, borrow, plan },
      answers,
    };

    // Simpan hasil skor sementara ke sessionStorage
    sessionStorage.setItem("financial_score_result", JSON.stringify(resultData));

    // Arahkan ke halaman review/financial-score
    router.push("/financial-score");
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4 fade-up">
      {/* Progress Bar 5 Halaman */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-sakuText">
          <span className="text-sakuPink">Asesmen Finansial Awal</span>
          <span>Halaman {step} dari 5</span>
        </div>
        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-sakuGreen h-full transition-all duration-300"
            style={{ width: `${step * 20}%` }}
          />
        </div>
      </div>

      {/* =========================================
          HALAMAN 1: BAGIAN A — PROFIL (TIDAK DISKOR)
         ========================================= */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-sakuGreen-light space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-sakuPink uppercase tracking-wider">
              Bagian A — Profil Kamu
            </span>
            <h2 className="text-xl font-extrabold text-sakuText mt-1">
              Kenalan Dulu Sama Sumber Cuan Kamu
            </h2>
            <p className="text-xs text-sakuText-muted mt-1">
              Bukan kepo ya, ini biar kami paham gaya pemasukan & belanja dapurmu.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* A1 */}
            <div className="space-y-2">
              <label className="block font-bold text-sakuText">
                Uang yang kamu kelola biasanya dari mana?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Gaji/kerja",
                  "Usaha/jualan",
                  "Pasangan/keluarga",
                  "Kerja lepas",
                  "Lainnya",
                ].map((opt) => {
                  const selected = answers.A1_sources.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMultiSelect("A1_sources", opt)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        selected
                          ? "bg-sakuGreen text-white border-sakuGreen"
                          : "bg-sakuIvory border-gray-200 text-sakuText hover:border-sakuGreen"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* A2 */}
            <div className="p-4 rounded-2xl bg-sakuIvory border border-sakuGreen-light space-y-3">
              <label className="block font-bold text-sakuText">
                Berapa uang yang kamu kelola?
              </label>
              <div className="flex gap-2">
                {["minggu", "bulan"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setAnswers({ ...answers, A2_period: p })}
                    className={`px-3 py-1.5 rounded-lg font-bold border capitalize ${
                      answers.A2_period === p
                        ? "bg-sakuGreen text-white border-sakuGreen"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    Per {p}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 font-bold text-gray-400">
                  Rp
                </span>
                <input
                  type="number"
                  value={answers.A2_amount}
                  onChange={(e) =>
                    setAnswers({ ...answers, A2_amount: Number(e.target.value) })
                  }
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sakuGreen-light font-bold bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* A3 */}
            <div className="space-y-2">
              <label className="block font-bold text-sakuText">
                Pengeluaran terbesarmu untuk apa?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Makan & dapur",
                  "Sekolah anak",
                  "Listrik & air",
                  "Transportasi",
                  "Pulsa & internet",
                  "Cicilan",
                  "Arisan",
                  "Kesehatan",
                ].map((opt) => {
                  const selected = answers.A3_biggest_expenses.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMultiSelect("A3_biggest_expenses", opt)}
                      className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                        selected
                          ? "bg-sakuGreen text-white border-sakuGreen"
                          : "bg-sakuIvory border-gray-200 text-sakuText hover:border-sakuGreen"
                      }`}
                    >
                      {selected ? "✓ " : "+ "}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* A3a Conditional */}
            {answers.A3_biggest_expenses.includes("Makan & dapur") && (
              <div className="p-4 rounded-2xl bg-sakuPink-light border border-sakuPink-border space-y-2">
                <label className="block font-bold text-sakuPink-dark">
                  Kira-kira berapa untuk makan & dapur sebulan?
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 font-bold text-sakuPink">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={answers.A3a_food_amount}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        A3a_food_amount: Number(e.target.value),
                      })
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-sakuPink-border font-bold bg-white text-sakuPink focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* A4 */}
            <div className="space-y-2">
              <label className="block font-bold text-sakuText">
                Kamu tinggal di kota mana?
              </label>
              <div className="flex gap-2 mb-2">
                {["Surabaya", "Jakarta", "Bandung"].map((ct) => (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => setAnswers({ ...answers, A4_city: ct })}
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      answers.A4_city === ct
                        ? "bg-sakuPink text-white border-sakuPink"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {ct}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={answers.A4_city}
                onChange={(e) => setAnswers({ ...answers, A4_city: e.target.value })}
                placeholder="Ketik nama kotamu..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-sakuGreen-light font-semibold focus:outline-none bg-sakuIvory"
              />
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-sakuGreen hover:bg-sakuGreen-hover text-white font-bold py-3.5 rounded-xl shadow-md text-xs"
          >
            Lanjut ke Pilar Belanja (SPEND) →
          </button>
        </div>
      )}

      {/* =========================================
          HALAMAN 2: PILAR SPEND (BELANJA) — 25%
         ========================================= */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-sakuGreen-light space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-sakuGreen uppercase tracking-wider">
              Pilar 1: SPEND (Belanja)
            </span>
            <h2 className="text-xl font-extrabold text-sakuText mt-1">
              Pengeluaran & Tagihan Rutin
            </h2>
          </div>

          <div className="space-y-5 text-xs">
            {/* B1 */}
            <div className="p-4 rounded-2xl bg-sakuIvory border border-sakuGreen-light space-y-3">
              <label className="block font-bold text-sakuText">
                Biasanya di akhir bulan, uangnya…
              </label>
              <div className="space-y-2">
                {[
                  { score: 100, text: "Masih sisa banyak (Skor: 100)" },
                  { score: 75, text: "Sisa sedikit (Skor: 75)" },
                  { score: 50, text: "Pas-pasan (Skor: 50)" },
                  { score: 25, text: "Kadang kurang (Skor: 25)" },
                  { score: 0, text: "Sering kurang (Skor: 0)" },
                ].map((opt) => (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, B1_month_end_money: opt.score })
                    }
                    className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                      answers.B1_month_end_money === opt.score
                        ? "bg-sakuGreen text-white border-sakuGreen"
                        : "bg-white border-gray-200 text-sakuText hover:border-sakuGreen"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* B1a Validasi */}
            {answers.B1_month_end_money >= 50 && (
              <div className="p-4 rounded-2xl bg-sakuGreen-light/50 border border-sakuGreen-light space-y-2">
                <label className="block font-bold text-sakuGreen-dark">
                 Jika sisa, kira-kira berapa?
                </label>
                <input
                  type="number"
                  value={answers.B1a_remaining_amount}
                  onChange={(e) =>
                    setAnswers({
                      ...answers,
                      B1a_remaining_amount: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-sakuGreen-light font-bold bg-white focus:outline-none"
                />
              </div>
            )}

            {/* B2 */}
            <div className="p-4 rounded-2xl bg-sakuIvory border border-sakuGreen-light space-y-3">
              <label className="block font-bold text-sakuText">
                Bulan lalu, tagihanmu (listrik, sekolah, cicilan) dibayar tepat waktu?
              </label>
              <div className="space-y-2">
                {[
                  { score: 100, text: "Semua (Skor: 100)" },
                  { score: 75, text: "Hampir semua (Skor: 75)" },
                  { score: 50, text: "Sebagian (Skor: 50)" },
                  { score: 25, text: "Sedikit (Skor: 25)" },
                  { score: 0, text: "Tidak ada (Skor: 0)" },
                ].map((opt) => (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, B2_bills_on_time: opt.score })
                    }
                    className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                      answers.B2_bills_on_time === opt.score
                        ? "bg-sakuGreen text-white border-sakuGreen"
                        : "bg-white border-gray-200 text-sakuText hover:border-sakuGreen"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-3 border rounded-xl text-xs font-bold text-gray-600"
            >
              Kembali
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-2/3 bg-sakuGreen text-white font-bold py-3 rounded-xl shadow-md text-xs"
            >
              Lanjut Pilar Menabung (SAVE) →
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          HALAMAN 3: PILAR SAVE (MENABUNG) — 25%
         ========================================= */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-sakuGreen-light space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-sakuPink uppercase tracking-wider">
              Pilar 2: SAVE (Menabung)
            </span>
            <h2 className="text-xl font-extrabold text-sakuText mt-1">
              Dana Darurat & Keyakinan Menabung
            </h2>
          </div>

          <div className="space-y-5 text-xs">
            {/* B3 */}
            <div className="p-4 rounded-2xl bg-sakuIvory border border-sakuGreen-light space-y-3">
              <label className="block font-bold text-sakuText">
                Kalau pemasukan tiba-tiba berhenti, tabunganmu cukup untuk berapa lama?
              </label>
              <div className="space-y-2">
                {[
                  { score: 100, text: "≥ 6 bulan (Skor: 100)" },
                  { score: 75, text: "3 – 5 bulan (Skor: 75)" },
                  { score: 50, text: "1 – 2 bulan (Skor: 50)" },
                  { score: 25, text: "1 – 3 minggu (Skor: 25)" },
                  { score: 0, text: "< 1 minggu / tidak ada (Skor: 0)" },
                ].map((opt) => (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, B3_emergency_fund: opt.score })
                    }
                    className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                      answers.B3_emergency_fund === opt.score
                        ? "bg-sakuGreen text-white border-sakuGreen"
                        : "bg-white border-gray-200 text-sakuText hover:border-sakuGreen"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* B4 */}
            <div className="p-4 rounded-2xl bg-sakuIvory border border-sakuGreen-light space-y-3">
              <label className="block font-bold text-sakuText">
                Seberapa yakin tabunganmu cukup untuk tujuan besar (pendidikan anak, hari tua)?
              </label>
              <div className="space-y-2">
                {[
                  { score: 100, text: "Sangat yakin (Skor: 100)" },
                  { score: 75, text: "Yakin (Skor: 75)" },
                  { score: 50, text: "Agak yakin (Skor: 50)" },
                  { score: 25, text: "Kurang yakin (Skor: 25)" },
                  { score: 0, text: "Tidak yakin sama sekali (Skor: 0)" },
                ].map((opt) => (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() =>
                      setAnswers({
                        ...answers,
                        B4_longterm_confidence: opt.score,
                      })
                    }
                    className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                      answers.B4_longterm_confidence === opt.score
                        ? "bg-sakuGreen text-white border-sakuGreen"
                        : "bg-white border-gray-200 text-sakuText hover:border-sakuGreen"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="w-1/3 py-3 border rounded-xl text-xs font-bold text-gray-600"
            >
              Kembali
            </button>
            <button
              onClick={() => setStep(4)}
              className="w-2/3 bg-sakuGreen text-white font-bold py-3 rounded-xl shadow-md text-xs"
            >
              Lanjut Pilar Utang (BORROW) →
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          HALAMAN 4: PILAR BORROW (UTANG) — 25%
         ========================================= */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-sakuGreen-light space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-sakuGreen uppercase tracking-wider">
              Pilar 3: BORROW (Utang)
            </span>
            <h2 className="text-xl font-extrabold text-sakuText mt-1">
              Pengelolaan Utang & Cicilan
            </h2>
          </div>

          <div className="space-y-5 text-xs">
            {/* B5 */}
            <div className="p-4 rounded-2xl bg-sakuIvory border border-sakuGreen-light space-y-3">
              <label className="block font-bold text-sakuText">
                Cicilan/utangmu (termasuk paylater & pinjol) terasa…
              </label>
              <div className="space-y-2">
                {[
                  { score: 100, text: "Tidak punya utang (Skor: 100 — B6 Dilewati)" },
                  { score: 75, text: "Ringan (Skor: 75)" },
                  { score: 50, text: "Sedang (Skor: 50)" },
                  { score: 25, text: "Berat (Skor: 25)" },
                  { score: 0, text: "Sangat berat (Skor: 0)" },
                ].map((opt) => (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, B5_debt_status: opt.score })
                    }
                    className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                      answers.B5_debt_status === opt.score
                        ? "bg-sakuGreen text-white border-sakuGreen"
                        : "bg-white border-gray-200 text-sakuText hover:border-sakuGreen"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* B6 Conditional */}
            {answers.B5_debt_status !== 100 ? (
              <div className="p-4 rounded-2xl bg-sakuIvory border border-sakuGreen-light space-y-3">
                <label className="block font-bold text-sakuText">
                  Setahun terakhir, pernah telat bayar cicilan/paylater/pinjol?
                </label>
                <div className="space-y-2">
                  {[
                    { score: 100, text: "Tidak pernah (Skor: 100)" },
                    { score: 75, text: "Pernah 1 kali (Skor: 75)" },
                    { score: 50, text: "2–3 kali (Skor: 50)" },
                    { score: 25, text: "Sering (Skor: 25)" },
                    { score: 0, text: "Sedang menunggak (Skor: 0)" },
                  ].map((opt) => (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() =>
                        setAnswers({
                          ...answers,
                          B6_credit_history: opt.score,
                        })
                      }
                      className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                        answers.B6_credit_history === opt.score
                          ? "bg-sakuGreen text-white border-sakuGreen"
                          : "bg-white border-gray-200 text-sakuText hover:border-sakuGreen"
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-sakuGreen-light/60 rounded-xl text-sakuGreen-dark font-bold text-center">
                Bebas Utang! Pertanyaan B6 otomatis dilewati (N/A) dan bernilai sempurna.
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(3)}
              className="w-1/3 py-3 border rounded-xl text-xs font-bold text-gray-600"
            >
              Kembali
            </button>
            <button
              onClick={() => setStep(5)}
              className="w-2/3 bg-sakuGreen text-white font-bold py-3 rounded-xl shadow-md text-xs"
            >
              Lanjut Pilar Rencana (PLAN) →
            </button>
          </div>
        </div>
      )}

      {/* =========================================
          HALAMAN 5: PILAR PLAN (RENCANA) — 25%
         ========================================= */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-sakuGreen-light space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-sakuPink uppercase tracking-wider">
              Pilar 4: PLAN (Rencana)
            </span>
            <h2 className="text-xl font-extrabold text-sakuText mt-1">
              Perlindungan & Rencana Ke depan
            </h2>
          </div>

          <div className="space-y-5 text-xs">
            {/* B7 */}
            <div className="p-4 rounded-2xl bg-sakuIvory border border-sakuGreen-light space-y-3">
              <label className="block font-bold text-sakuText">
                Seberapa yakin BPJS/asuransimu cukup melindungi keluarga?
              </label>
              <div className="space-y-2">
                {[
                  { score: 100, text: "Sangat yakin (Skor: 100)" },
                  { score: 75, text: "Yakin (Skor: 75)" },
                  { score: 50, text: "Agak yakin (Skor: 50)" },
                  { score: 25, text: "Kurang yakin (Skor: 25)" },
                  { score: 0, text: "Tidak punya / tidak yakin sama sekali (Skor: 0)" },
                ].map((opt) => (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() =>
                      setAnswers({
                        ...answers,
                        B7_insurance_confidence: opt.score,
                      })
                    }
                    className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                      answers.B7_insurance_confidence === opt.score
                        ? "bg-sakuGreen text-white border-sakuGreen"
                        : "bg-white border-gray-200 text-sakuText hover:border-sakuGreen"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>

            {/* B8 */}
            <div className="p-4 rounded-2xl bg-sakuIvory border border-sakuGreen-light space-y-3">
              <label className="block font-bold text-sakuText">
                Aku punya rencana keuangan untuk ke depan.
              </label>
              <div className="space-y-2">
                {[
                  { score: 100, text: "Sangat setuju (Skor: 100)" },
                  { score: 75, text: "Setuju (Skor: 75)" },
                  { score: 50, text: "Ragu-ragu (Skor: 50)" },
                  { score: 25, text: "Tidak setuju (Skor: 25)" },
                  { score: 0, text: "Sangat tidak setuju (Skor: 0)" },
                ].map((opt) => (
                  <button
                    key={opt.score}
                    type="button"
                    onClick={() =>
                      setAnswers({ ...answers, B8_future_plan: opt.score })
                    }
                    className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
                      answers.B8_future_plan === opt.score
                        ? "bg-sakuGreen text-white border-sakuGreen"
                        : "bg-white border-gray-200 text-sakuText hover:border-sakuGreen"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(4)}
              className="w-1/3 py-3 border rounded-xl text-xs font-bold text-gray-600"
            >
              Kembali
            </button>
            <button
              onClick={handleCalculateAndFinish}
              className="w-2/3 bg-sakuPink hover:bg-sakuPink-hover text-white font-bold py-3.5 rounded-xl shadow-lg text-xs"
            >
              Hitung Skor Finansial Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}