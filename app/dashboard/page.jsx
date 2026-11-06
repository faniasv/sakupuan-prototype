"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icons } from "../components/ui/Icons";
import TelegramModal from "../components/profile/TelegramModal";
import AIAdvisor from "../components/ai/AI-Advisor";

export default function DashboardPage() {
  const router = useRouter();

  const [showTelegramModal, setShowTelegramModal] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("telegram_modal_dismissed");
    }
    return false;
  });

  const [advisorOpen, setAdvisorOpen] = useState(false);

  const user = {
    name: "Vivin",
    city: "Surabaya",
  };

  const scoreResult = {
    totalScore: 81,
    status: "Masak Sultan, Hati Tenang",
    period: "Sep 2026",
  };

  const handleDismissModal = () => {
    setShowTelegramModal(false);
    sessionStorage.setItem("telegram_modal_dismissed", "true");
  };

  const handleConnectTelegram = () => {
    setShowTelegramModal(false);
    sessionStorage.setItem("telegram_modal_dismissed", "true");
    router.push("/telegram-connect");
  };

  const cardCls =
    "w-full text-left bg-white rounded-3xl border border-sakuGreen-light p-4 flex items-center gap-3 transition-shadow hover:shadow-soft cursor-pointer";

  return (
    <div className="max-w-xl mx-auto space-y-4 py-6 px-4 fade-up relative">
      {/* Header Sapaan */}
      <div>
        <p className="text-xs font-semibold text-sakuText-muted">Halo</p>
        <h2 className="text-2xl font-extrabold text-sakuText tracking-tight">{user.name}</h2>
      </div>

      {/* Card 1 — Financial Health Score */}
      <section className="rounded-3xl bg-linear-to-br from-sakuGreen to-sakuGreen-dark text-white p-6 shadow-soft space-y-4">
        <div className="flex justify-between items-center text-sakuGreen-border">
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            FINANCIAL HEALTH SCORE
          </span>
          <span className="text-xs font-medium">{scoreResult.period}</span>
        </div>
        <p className="leading-none flex items-baseline gap-1">
          <span className="text-5xl font-extrabold">{scoreResult.totalScore}</span>
          <span className="text-lg font-semibold text-sakuGreen-border">/100</span>
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold bg-white text-sakuGreen-dark px-3.5 py-1.5 rounded-full shadow-xs">
            ● {scoreResult.status}
          </span>
          <Link href="/review" className="text-xs font-bold text-white hover:underline">
            Lihat Skor →
          </Link>
        </div>
      </section>

      {/* Card 2 — Insight Arus Kas */}
      <div onClick={() => router.push("/insight")} className={`${cardCls} bg-sakuPink-light border-sakuPink-border`}>
        <span className="w-10 h-10 rounded-full bg-sakuPink text-white flex items-center justify-center shrink-0">
          <Icons.Bulb className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <span className="block text-[10px] font-bold uppercase text-sakuPink tracking-wider">
            INSIGHT ARUS KAS
          </span>
          <span className="block text-sm font-extrabold text-sakuText truncate">
            Belanja naik 18% dibanding bulan lalu
          </span>
          <span className="block text-xs text-sakuText-muted leading-relaxed line-clamp-2">
            Arus kas keluar lebih besar dari biasanya, bisa kurangi jatah tabungan Puan bulan ini.
          </span>
        </div>
        <svg className="w-5 h-5 text-sakuPink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Card 3 — Forecast */}
      <div onClick={() => router.push("/forecast")} className={cardCls}>
        <span className="w-10 h-10 rounded-2xl bg-sakuGreen-light text-sakuGreen flex items-center justify-center shrink-0">
          <Icons.Trend className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <span className="block text-[10px] font-bold uppercase text-sakuGreen tracking-wider">
            FORECAST
          </span>
          <span className="block text-sm font-bold text-sakuText truncate">
            Dampak Harga Pangan & Proyeksi Saldo
          </span>
          <span className="block text-xs text-sakuText-muted leading-relaxed line-clamp-2">
            Harga cabai naik 8% bisa tambah belanja dapur Rp 120rb/bulan. Saldo diproyeksikan Rp 8.4M di 2027.
          </span>
        </div>
        <svg className="w-5 h-5 text-sakuGreen shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Card 4 — Rekomendasi Tersedia */}
      <div onClick={() => router.push("/rekomendasi")} className={`${cardCls} border-dashed border-sakuPink`}>
        <span className="w-10 h-10 rounded-2xl bg-sakuPink-light text-sakuPink flex items-center justify-center shrink-0">
          <Icons.List className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0">
          <span className="block text-sm font-bold text-sakuText">
            Rekomendasi Tersedia
          </span>
          <span className="block text-xs text-sakuText-muted">
            Langkah konkret buat bantu naikin kapasitas tabungan Puan.
          </span>
        </div>
        <svg className="w-5 h-5 text-sakuPink shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {/* Floating AI Advisor Button */}
      <div className="fixed right-4 bottom-6 z-40 flex flex-col items-end gap-3">
        {advisorOpen && (
          <AIAdvisor name={user.name} city={user.city} onClose={() => setAdvisorOpen(false)} />
        )}
        <button
          onClick={() => setAdvisorOpen((v) => !v)}
          className="flex items-center gap-2 bg-sakuGreen hover:bg-sakuGreen-hover text-white font-bold text-xs pl-4 pr-5 py-3 rounded-full shadow-floating transition-transform active:scale-95"
        >
          <Icons.Bot className="w-5 h-5" />
          <span>{advisorOpen ? "Tutup" : "AI Advisor"}</span>
        </button>
      </div>

      {/* Modal Prompt Telegram */}
      <TelegramModal
        open={showTelegramModal}
        onConnect={handleConnectTelegram}
        onDismiss={handleDismissModal}
      />
    </div>
  );
}