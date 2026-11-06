"use client";
import Link from "next/link";
import { Icons } from "../components/ui/Icons";
import { AdvisorToggle } from "../components/AI-Advisor";

export default function DashboardPage() {
  const user = { name: "Puan", city: "Surabaya" };
  const scoreResult = { totalScore: 82 };

  return (
    <div className="max-w-xl mx-auto space-y-4 fade-up">
      {/* Header Dashboard */}
      <div>
        <p className="text-xs font-semibold text-sakuText-muted">Halo</p>
        <h2 className="text-xl font-extrabold text-sakuText tracking-tight">
          {user.name}
        </h2>
      </div>

      {/* Card 1 — Financial Health Score */}
      <section className="rounded-3xl bg-linear-to-br from-sakuGreen to-sakuGreen-dark text-white p-5 shadow-soft space-y-3">
        <div className="flex justify-between text-sakuGreen-border">
          <span className="text-[10px] font-extrabold uppercase tracking-wider">
            Financial Health Score
          </span>
          <span className="text-[11px]">Bulan Ini</span>
        </div>
        <p className="leading-none">
          <span className="text-5xl font-extrabold">{scoreResult.totalScore}</span>
          <span className="text-lg font-semibold text-sakuGreen-border">/100</span>
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold bg-sakuGreen-border text-sakuGreen-dark px-3 py-1 rounded-full">
            ● {scoreResult.totalScore >= 80 ? "Masak Sultan, Hati Tenang" : "Dapur Aman"}
          </span>
        </div>
      </section>

      {/* Card 2 — AI Insight Navigation */}
      <Link href="/insight" className="w-full text-left bg-sakuPink-light border border-sakuPink-border rounded-[20px] p-4 flex items-center gap-3 transition-shadow hover:shadow-soft">
        <span className="w-10 h-10 rounded-full bg-sakuPink text-white flex items-center justify-center shrink-0">
          <Icons.Bulb className="w-5 h-5" />
        </span>
        <span className="flex-1">
          <span className="block text-[10px] font-bold uppercase text-sakuPink">
            Insight Arus Kas
          </span>
          <span className="block text-sm font-extrabold text-sakuText">
            Belanja naik 18% dibanding bulan lalu
          </span>
          <span className="block text-xs text-sakuText-muted mt-0.5 line-clamp-2">
            Arus kas keluar lebih besar dari biasanya, cek rincian belanja dapur Puan bulan ini.
          </span>
        </span>
        <Icons.Chevron className="text-sakuPink" />
      </Link>

      {/* Card 3 — Forecast Navigation */}
      <Link href="/prediksi" className="w-full text-left bg-white rounded-[20px] border border-sakuGreen-light p-4 flex items-center gap-3 transition-shadow hover:shadow-soft">
        <span className="w-10 h-10 rounded-xl bg-sakuGreen-light text-sakuGreen flex items-center justify-center shrink-0">
          <Icons.Trend className="w-5 h-5" />
        </span>
        <span className="flex-1">
          <span className="block text-[10px] font-bold uppercase text-sakuGreen">
            Forecast
          </span>
          <span className="block text-sm font-bold text-sakuText">
            Dampak Harga Pangan & Saldo
          </span>
        </span>
        <Icons.Chevron className="text-sakuGreen" />
      </Link>

      {/* Card 4 — Action Plan Navigation */}
      <Link href="/action-plan" className="w-full text-left bg-white rounded-[20px] border border-sakuPink p-4 flex items-center gap-3 transition-shadow hover:shadow-soft border-dashed">
        <span className="w-10 h-10 rounded-xl bg-sakuPink-light text-sakuPink flex items-center justify-center shrink-0">
          <Icons.List className="w-5 h-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-sakuText">
            Rencana Tersedia
          </span>
          <span className="block text-xs text-sakuText-muted mt-0.5">
            Lihat langkah konkret untuk atur kapasitas tabungan.
          </span>
        </span>
        <Icons.Chevron className="text-sakuPink" />
      </Link>

      {/* AI Advisor floating widget */}
      <AdvisorToggle name={user.name} city={user.city} />
    </div>
  );
}