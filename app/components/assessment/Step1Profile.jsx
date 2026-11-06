"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/app/components/providers/AppProvider";
import { A1_OPTIONS, A3_OPTIONS } from "@/lib/assessment";
import { CITIES } from "@/lib/constants";
import { AssessmentCard, StepHeader, StepNav } from "./parts";

function Chips({ options, selected, onToggle }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((opt) => {
        const on = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
              on ? "bg-[#1F5932] text-white border-[#1F5932]" : "bg-[#FBF8F5] border-gray-200 text-[#1E2D24] hover:border-[#1F5932]"
            }`}
          >
            {on ? "✓ " : "+ "}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export default function Step1Profile() {
  const router = useRouter();
  const { answers, setAnswer, toggleMulti } = useApp();

  return (
    <AssessmentCard bigText>
      <StepHeader big eyebrow="Bagian A — Profil Kamu" title="Kenalan Dulu Sama Sumber Cuan Kamu" desc="Bukan kepo ya, ini biar kami paham gaya pemasukan & belanja dapurmu." />

      <div className="space-y-5 text-xs md:text-sm md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-8 md:space-y-0">
        {/* A1 */}
        <div className="space-y-2">
          <label className="block font-bold text-[#1E2D24]">Uang yang kamu kelola dari mana aja?</label>
          <Chips options={A1_OPTIONS} selected={answers.A1_sources} onToggle={(o) => toggleMulti("A1_sources", o)} />
        </div>

        {/* A2 */}
        <div className="p-4 rounded-2xl bg-[#FBF8F5] border border-[#EAF3EC] space-y-3">
          <label className="block font-bold text-[#1E2D24]">Berapa total uang yang kamu kelola?</label>
          <div className="flex gap-2">
            {[
              ["minggu", "Per Minggu", "bg-[#FF4B93] text-white border-[#FF4B93]"],
              ["bulan", "Per Bulan", "bg-[#1F5932] text-white border-[#1F5932]"],
            ].map(([id, label, on]) => (
              <button
                key={id}
                type="button"
                onClick={() => setAnswer("A2_period", id)}
                className={`px-3 py-1.5 rounded-lg font-bold border ${answers.A2_period === id ? on : "bg-white border-gray-300"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 font-bold text-gray-500">Rp</span>
            <input
              type="number"
              min={0}
              value={answers.A2_amount}
              onChange={(e) => setAnswer("A2_amount", Number(e.target.value))}
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-gray-300 font-bold bg-white focus:outline-none focus:border-[#1F5932]"
            />
          </div>
        </div>

        {/* A3 */}
        <div className="space-y-2">
          <label className="block font-bold text-[#1E2D24]">Pos pengeluaran terbesarmu buat apa?</label>
          <Chips options={A3_OPTIONS} selected={answers.A3_biggest_expenses} onToggle={(o) => toggleMulti("A3_biggest_expenses", o)} />
        </div>

        {/* A3a (conditional) */}
        {answers.A3_biggest_expenses.includes("Makan & dapur") && (
          <div className="p-4 rounded-2xl bg-[#FFF0F6] border border-[#FFC2DC] space-y-2">
            <label className="block font-bold text-[#C71C63]">Khusus Makan & Dapur, habis berapa sebulan?</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-[#FF4B93]">Rp</span>
              <input
                type="number"
                min={0}
                value={answers.A3a_food_amount}
                onChange={(e) => setAnswer("A3a_food_amount", Number(e.target.value))}
                className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-[#FFC2DC] font-bold bg-white text-[#FF4B93] focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-gray-500">*Data ini dipake buat fiturnya pemantau harga sembako lokal di kotamu!</p>
          </div>
        )}

        {/* A4 */}
        <div className="space-y-2">
          <label className="block font-bold text-[#1E2D24]">Domisili kamu di kota mana?</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {CITIES.map((ct) => (
              <button
                key={ct}
                type="button"
                onClick={() => setAnswer("A4_city", ct)}
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  answers.A4_city === ct ? "bg-[#FF4B93] text-white border-[#FF4B93]" : "bg-gray-100 text-gray-700"
                }`}
              >
                {ct}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={answers.A4_city}
            onChange={(e) => setAnswer("A4_city", e.target.value)}
            placeholder="Ketik nama kotamu..."
            className="w-full px-3.5 py-2 rounded-xl border border-gray-300 font-semibold focus:outline-none"
          />
        </div>
      </div>

      <StepNav onNext={() => router.push("/assessment/2")} nextLabel="Lanjut ke Pilar Belanja (SPEND)" />
    </AssessmentCard>
  );
}
