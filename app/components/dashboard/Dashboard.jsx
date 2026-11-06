'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/app/components/providers/AppProvider';
import { Icons } from '@/app/components/ui/Icons';
import TelegramPrompt from './TelegramPrompt';

export default function Dashboard() {
  const router = useRouter();
  const { user, score, telegramPromptSeen, setTelegramPromptSeen } = useApp();
    const Chevron = ({ className = "" }) => (<svg className={`w-5 h-5 shrink-0 ${className}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 6l6 6-6 6"/>
  </svg>);
    const card = "w-full text-left bg-white rounded-[20px] border border-sakuGreen-light p-4 flex items-center gap-3 transition-shadow hover:shadow-soft";
    return (<div className="max-w-xl mx-auto space-y-4 fade-up">
    {/* Header */}
    <div>
      <div>
        <p className="text-xs font-semibold text-sakuText-muted">
          Halo
        </p>
        <h2 className="text-xl font-extrabold text-sakuText tracking-tight">
          {user.name}
        </h2>
      </div>
    </div>

    {/* Card 1 — Financial Health Score */}
    <section className="rounded-3xl bg-gradient-to-br from-sakuGreen to-sakuGreen-dark text-white p-5 shadow-soft space-y-3">
      <div className="flex justify-between text-sakuGreen-border">
        <span className="text-[10px] font-extrabold uppercase tracking-wider">
          Financial Health Score
        </span>
        <span className="text-[11px]">Sep 2026</span>
      </div>
      <p className="leading-none">
        <span className="text-5xl font-extrabold">
          {score.totalScore}
        </span>
        <span className="text-lg font-semibold text-sakuGreen-border">
          /100
        </span>
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold bg-sakuGreen-border text-sakuGreen-dark px-3 py-1 rounded-full">
          ●{" "}
          {score.totalScore >= 80
            ? "Masak Sultan, Hati Tenang"
            : score.totalScore >= 40
                ? "Dapur Aman"
                : "Perlu Perhatian"}
        </span>
        <button onClick={() => router.push("/review")} className="text-xs font-bold text-white hover:underline">
          Lihat Skor →
        </button>
      </div>
    </section>

    {/* Card 3 — AI Insight */}
    <button onClick={() => router.push("/insight")} className="w-full text-left bg-sakuPink-light border border-sakuPink-border rounded-[20px] p-4 flex items-center gap-3">
      <span className="w-10 h-10 rounded-full bg-sakuPink text-white flex items-center justify-center shrink-0">
        <Icons.Bulb className="w-5 h-5"/>
      </span>
      <span className="flex-1">
        <span className="block text-[10px] font-bold uppercase text-sakuPink">
          Insight Arus Kas
        </span>
        <span className="block text-sm font-extrabold text-sakuText">
          Belanja naik 18% dibanding bulan lalu
        </span>
        <span className="block text-xs text-sakuText-muted">
          Arus kas keluar lebih besar dari biasanya, bisa kurangi
          jatah tabungan Puan bulan ini.
        </span>
      </span>
      <Chevron className="text-sakuPink"/>
    </button>

    {/* Card 4 — Forecast */}
    <button onClick={() => router.push("/forecast")} className={card}>
      <span className="w-10 h-10 rounded-xl bg-sakuGreen-light text-sakuGreen flex items-center justify-center shrink-0">
        <Icons.Trend className="w-5 h-5"/>
      </span>
      <span className="flex-1">
        <span className="block text-[10px] font-bold uppercase text-sakuGreen">
          Forecast
        </span>
        <span className="block text-sm font-bold text-sakuText">
          Dampak Harga Pangan & Proyeksi Saldo
        </span>
        <span className="block text-xs text-sakuText-muted">
          Harga cabai naik 8% bisa tambah belanja dapur Rp
          120rb/bulan. Saldo diproyeksikan Rp 8.4M di 2027.
        </span>
      </span>
      <Chevron className="text-sakuGreen"/>
    </button>

    {/* Card 5 — Recommendation */}
    <button onClick={() => router.push("/recommendation")} className={`${card} border-dashed border-sakuPink`}>
      <span className="w-10 h-10 rounded-xl bg-sakuPink-light text-sakuPink flex items-center justify-center shrink-0">
        <Icons.List className="w-5 h-5"/>
      </span>
      <span className="flex-1">
        <span className="block text-sm font-bold text-sakuText">
          Rekomendasi Tersedia
        </span>
        <span className="block text-xs text-sakuText-muted">
          Langkah konkret buat bantu naikin kapasitas tabungan Puan.
        </span>
      </span>
      <Chevron className="text-sakuPink"/>
    </button>

    {!user.telegramConnected && !telegramPromptSeen && (<TelegramPrompt onConnect={() => {
                setTelegramPromptSeen(true);
                router.push("/telegram");
            }} onDismiss={() => setTelegramPromptSeen(true)}/>)}
  </div>);
}
