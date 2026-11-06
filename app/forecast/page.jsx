"use client";
import Link from "next/link";
import BalanceProjectionChart from "../components/forecast/BalanceProjectionChart";
import PriceTrendCard from "../components/forecast/PriceTrendCard";
import { Icons } from "../components/ui/Icons";

const historyData = [
  { month: "Mei", balance: 4200000 },
  { month: "Juni", balance: 3900000 },
  { month: "Juli", balance: 4100000 },
];

const projectionData = [
  { month: "Agustus", balance: 3850000 },
  { month: "September", balance: 3700000 },
];

const trendItems = [
  { name: "Cabai Merah", desc: "Estimasi naik akibat musim panen mundur", trend: "up", change: "+8%" },
  { name: "Beras Premium", desc: "Stok distributor stabil di area lokal", trend: "stable", change: "0%" },
  { name: "Minyak Goreng", desc: "Kecenderungan stabil menjelang akhir bulan", trend: "stable", change: "-2%" },
];

export default function ForecastPage() {
  return (
    <div className="max-w-xl mx-auto space-y-4 fade-up">
      {/* Header Navigasi */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-xl text-sakuText hover:bg-sakuGreen-light">
          <Icons.Chevron className="w-5 h-5 rotate-180" />
        </Link>
        <h2 className="text-lg font-extrabold text-sakuText">Forecast & Prediksi</h2>
      </div>

      {/* Card Proyeksi Saldo */}
      <section className="bg-white rounded-3xl border border-sakuGreen-light p-5 space-y-4 shadow-soft">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sakuGreen">Proyeksi Keuangan</span>
          <h3 className="text-sm font-extrabold text-sakuText">Simulasi Sisa Saldo 2 Bulan ke Depan</h3>
        </div>
        <BalanceProjectionChart history={historyData} projection={projectionData} />
      </section>

      {/* Card Tren Harga Pangan */}
      <section className="bg-white rounded-3xl border border-sakuGreen-light p-5 space-y-4 shadow-soft">
        <PriceTrendCard items={trendItems} />
      </section>
    </div>
  );
}