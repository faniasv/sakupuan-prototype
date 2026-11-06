"use client";
import { useState } from "react";
import Link from "next/link";
import RecommendationCard from "../components/rekomendasi/RecommendationCard";
import { Icons } from "../components/ui/Icons";

const INITIAL_RECS = [
  {
    id: 1,
    category: "Belanja Dapur",
    title: "Substitusi Komoditas Cabai",
    description: "Harga cabai merah sedang naik di pasaran. Coba gunakan cabai kering atau stok frozen lokal untuk menekan pengeluaran dapur hingga 15% minggu ini.",
    savingEstimate: "Rp 75.000 / minggu",
  },
  {
    id: 2,
    category: "Pengeluaran Rutin",
    title: "Evaluasi Langganan Digital",
    description: "Terdeteksi ada 3 layanan hiburan streaming yang jarang aktif dalam sebulan terakhir. Membatalkan salah satunya bisa mengamankan alokasi tabungan darurat.",
    savingEstimate: "Rp 120.000 / bulan",
  },
];

export default function RecommendationPage() {
  const [recs, setRecs] = useState(INITIAL_RECS);

  const handleAction = (id) => {
    setRecs((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 fade-up">
      {/* Header Navigasi */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-xl text-sakuText hover:bg-sakuGreen-light">
          <Icons.Chevron className="w-5 h-5 rotate-180" />
        </Link>
        <h2 className="text-lg font-extrabold text-sakuText">Rekomendasi AI</h2>
      </div>

      {/* Daftar Rekomendasi */}
      <div className="space-y-3">
        {recs.length > 0 ? (
          recs.map((rec) => (
            <RecommendationCard key={rec.id} recommendation={rec} onAction={handleAction} />
          ))
        ) : (
          <div className="bg-white rounded-3xl border border-sakuGreen-light p-8 text-center space-y-2">
            <p className="text-sm font-bold text-sakuText">Semua Saran Sudah Diterapkan!</p>
            <p className="text-xs text-sakuText-muted">Hebat, Puan menjaga keuangan dapur dengan sangat disiplin minggu ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}