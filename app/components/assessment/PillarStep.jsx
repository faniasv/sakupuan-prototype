"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/components/providers/AppProvider";
import { QUESTIONS } from "@/lib/assessment";
import { AssessmentCard, MoneyInput, QuestionBlock, StepHeader, StepNav } from "./parts";

// Steps 2-5 share one layout; only the copy and questions differ.
const STEPS = {
  2: { eyebrow: "Pilar 1: SPEND (Belanja)", green: true, title: "Cek Aliran Dapur & Tagihan Rutin", desc: "Mari kita lihat gimana dompet kamu berjuang di penghujung bulan!", next: "Lanjut Pilar Menabung (SAVE)", keys: ["B1_month_end_money", "B2_bills_on_time"] },
  3: { eyebrow: "Pilar 2: SAVE (Menabung)", title: "Uji Ketahanan Dana Darurat & Tabungan", desc: "Nabung itu kayak payung, baru berasa gunanya pas hujan datang dadakan!", next: "Lanjut Pilar Utang (BORROW)", keys: ["B3_emergency_fund", "B4_longterm_confidence"] },
  4: { eyebrow: "Pilar 3: BORROW (Utang & Cicilan)", green: true, title: "Cek Beban Cicilan & Paylater", desc: "Utang itu alat, bukan beban... asal ukurannya pas di badan!", next: "Lanjut Pilar Rencana (PLAN)", keys: ["B5_debt_status", "B6_credit_history"] },
  5: { eyebrow: "Pilar 4: PLAN (Rencana Masa Depan)", title: "Perlindungan & Rencana Masa Depan", desc: "Langkah terakhir sebelum Mimin kalkulasi skor kesehatan keuanganmu!", next: "Hitung Skor Finansial Sekarang", keys: ["B7_insurance_confidence", "B8_future_plan"] },
};

export default function PillarStep({ step }) {
  const router = useRouter();
  const { answers, setAnswer, submitAssessment } = useApp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cfg = STEPS[step];
  const last = step === 5;

  const next = async () => {
    if (!last) return router.push(`/assessment/${step + 1}`);
    setBusy(true);
    setError("");
    try {
      await submitAssessment(); // POST /api/assessment: validates + saves
      router.push("/review");
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AssessmentCard>
      <StepHeader eyebrow={cfg.eyebrow} green={cfg.green} title={cfg.title} desc={cfg.desc} />
      <div className="space-y-5 text-xs">
        {cfg.keys.map((key) => {
          // B1a: only asked when there is money left at month end
          if (key === "B6_credit_history" && answers.B5_debt_status === 100) {
            return (
              <div key={key} className="p-3.5 bg-[#EAF3EC] rounded-xl text-[#1F5932] font-bold text-center">
                Bebas Utang! Indikator B6 otomatis N/A dan bernilai sempurna (100).
              </div>
            );
          }
          return (
            <div key={key} className="space-y-5">
              <QuestionBlock question={QUESTIONS[key]} value={answers[key]} onChange={(v) => setAnswer(key, v)} />
              {key === "B1_month_end_money" && answers.B1_month_end_money >= 50 && (
                <div className="p-4 rounded-2xl bg-[#EAF3EC] border border-[#B8D8C0] space-y-2">
                  <label className="block font-bold text-[#1F5932]">Kalo sisa, estimasi sisanya berapa?</label>
                  <MoneyInput value={answers.B1a_remaining_amount} onChange={(v) => setAnswer("B1a_remaining_amount", v)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <StepNav
        onBack={() => router.push(`/assessment/${step - 1}`)}
        onNext={next}
        nextLabel={cfg.next}
        pink={last}
        busy={busy}
        error={error}
      />
    </AssessmentCard>
  );
}
