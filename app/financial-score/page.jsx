"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "../components/ui/Icons";

const fallbackResult = {
  totalScore: 81,
  label: "Masak Sultan, Hati Tenang",
  pillars: { spend: 87.5, save: 75, borrow: 87.5, plan: 75 },
};

function subscribeToScore(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSavedScore() {
  return sessionStorage.getItem("financial_score_result");
}

export default function FinancialScorePage() {
  const router = useRouter();
  const savedData = useSyncExternalStore(subscribeToScore, getSavedScore, () => null);
  const result = savedData ? JSON.parse(savedData) : fallbackResult;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 fade-up">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-soft border border-sakuGreen-light space-y-8">
        {/* Header Status Skor */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-sakuPink-light text-sakuPink flex items-center justify-center mx-auto text-2xl shadow-xs">
            <Icons.Sparkles className="w-7 h-7" />
          </div>
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-sakuGreen-light text-sakuGreen border border-sakuGreen-border">
            {result.label}
          </div>
          <p className="text-xs text-sakuText-muted">Posisi keuangan Puan udah super stabil!</p>
        </div>

        {/* Skor Utama & 4 Pilar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold text-sakuText-muted">Skor Awal</p>
              <p className="text-4xl font-extrabold text-sakuText mt-0.5">
                {result.totalScore}
                <span className="text-base font-semibold text-sakuText-muted">/100</span>
              </p>
              <p className="text-[11px] text-sakuText-light mt-0.5">(Estimasi Awal)</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-sakuText">Rincian 4 Pilar Dapur Puan</p>
              {[
                { name: "Belanja", code: "SPEND", val: result.pillars.spend },
                { name: "Utang", code: "BORROW", val: result.pillars.borrow },
                { name: "Tabungan", code: "SAVE", val: result.pillars.save },
                { name: "Rencana", code: "PLAN", val: result.pillars.plan },
              ].map((pl) => (
                <div
                  key={pl.code}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-sakuIvory border border-sakuGreen-light text-xs"
                >
                  <span className="text-sakuText font-medium">
                    {pl.name} <span className="text-[10px] text-sakuText-muted">({pl.code})</span>
                  </span>
                  <div className="text-right">
                    <span className="font-bold text-sakuGreen">{pl.val}/100</span>
                    <span className="block text-[10px] text-sakuText-light">Aman jaya</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight & Tombol Aksi */}
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-sakuIvory border border-sakuGreen-light space-y-2 text-xs">
              <p className="font-bold text-sakuGreen flex items-center gap-1">
                <Icons.Bulb className="w-4 h-4 text-sakuGreen" /> Insight Mimin SAKUPUAN:
              </p>
              <p className="text-sakuText-muted leading-relaxed">
                Keren Puan! Pos belanjamu aman jaya ({result.pillars.spend}/100). Nah, biar makin tenang kalau ada keperluan mendadak, yuk pelan-pelan kita isi tabungan daruratnya!
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => router.push("/telegram-connect")}
                className="w-full bg-sakuPink hover:bg-sakuPink-hover text-white font-bold py-3.5 rounded-2xl shadow-md text-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Icons.Telegram className="w-4 h-4" /> Catat Belanja via Telegram (Biar Akurat)
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full text-center text-xs font-semibold text-sakuText-muted hover:text-sakuText py-2"
              >
                Langsung Masuk ke Dashboard Utama
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}