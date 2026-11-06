"use client";
import { useState } from "react";
import Link from "next/link";
import InsightChart from "../components/insight/InsightChart";
import CategoryBreakdown from "../components/insight/CategoryBreakdown"; // Import komponen
import { Icons } from "../components/ui/Icons";

const CATEGORIES = {
  makanan: { label: "Makanan & minuman", color: "#2BA89A" },
  "belanja-dapur": { label: "Belanja dapur", color: "#E8743B" },
  transportasi: { label: "Transportasi", color: "#1F5932" },
  tagihan: { label: "Tagihan & utilitas", color: "#3B82C4" },
};

const TRANSACTIONS = [
  { id: 1, flow: "out", cat: "belanja-dapur", title: "Sayur & bumbu pasar", date: "8 Sep 2026", amount: 250000 },
  { id: 2, flow: "out", cat: "makanan", title: "Jajan bakso", date: "14 Sep 2026", amount: 45000 },
  { id: 3, flow: "out", cat: "transportasi", title: "Ojol ke pasar", date: "9 Sep 2026", amount: 31200 },
  { id: 4, flow: "out", cat: "tagihan", title: "Listrik PLN", date: "3 Sep 2026", amount: 420000 },
];

const rp = (n) => `Rp ${n.toLocaleString("id-ID")}`;

export default function InsightPage() {
  const [flow, setFlow] = useState("out");
  const totalOut = TRANSACTIONS.reduce((s, t) => s + t.amount, 0);

  const breakdown = Object.entries(CATEGORIES).map(([id, cat]) => {
    const amount = TRANSACTIONS.filter((t) => t.cat === id).reduce((s, t) => s + t.amount, 0);
    return {
      id,
      label: cat.label,
      color: cat.color,
      amount,
      pct: totalOut > 0 ? (amount / totalOut) * 100 : 0,
    };
  }).filter((b) => b.amount > 0);

  return (
    <div className="max-w-xl mx-auto space-y-4 fade-up">
      {/* Header Navigasi */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-xl text-sakuText hover:bg-sakuGreen-light">
          <Icons.Chevron className="w-5 h-5 rotate-180" />
        </Link>
        <h2 className="text-lg font-extrabold text-sakuText">Insight Arus Kas</h2>
      </div>

      {/* Ringkasan Card */}
      <section className="rounded-3xl bg-linear-to-br from-sakuGreen to-sakuGreen-dark text-white p-5 shadow-soft space-y-2">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-sakuGreen-border">Total Pengeluaran Bulan Ini</p>
        <p className="text-3xl font-extrabold tabular-nums">{rp(totalOut)}</p>
        <p className="text-xs text-sakuGreen-border">Belanja kebutuhan pangan naik 18% dibanding bulan lalu.</p>
      </section>

      {/* Konten Grafik & Rincian */}
      <section className="bg-white rounded-3xl border border-sakuGreen-light p-5 space-y-4">
        <div role="tablist" className="grid grid-cols-2 p-1 bg-sakuIvory rounded-full">
          <button
            onClick={() => setFlow("out")}
            className={`py-2 rounded-full text-xs font-bold transition-colors ${flow === "out" ? "bg-sakuGreen text-white shadow-xs" : "text-sakuText-muted"}`}
          >
            Pengeluaran
          </button>
          <button
            onClick={() => setFlow("in")}
            className={`py-2 rounded-full text-xs font-bold transition-colors ${flow === "in" ? "bg-sakuGreen text-white shadow-xs" : "text-sakuText-muted"}`}
          >
            Pemasukan
          </button>
        </div>

        {flow === "out" ? (
          <>
            <InsightChart breakdown={breakdown} flowLabel="pengeluaran" flowTotal={totalOut} />
            
            {/* Menggunakan Komponen CategoryBreakdown */}
            <CategoryBreakdown breakdown={breakdown} />
          </>
        ) : (
          <div className="py-12 text-center text-xs text-sakuText-muted">
            Belum ada catatan pemasukan di periode ini.
          </div>
        )}
      </section>
    </div>
  );
}