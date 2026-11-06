'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Arrow, Check, Container } from './primitives';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export default function Hero({ openAuth }) {
  return (
    <section className="py-10 sm:py-12 lg:py-20 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sakuPink-light border border-sakuPink-border text-sakuPink-dark text-xs sm:text-sm font-semibold">
              <span className="w-2 h-2 shrink-0 rounded-full bg-sakuPink animate-pulse"/>
              Pengelolaan keuangan personal yang lebih kontekstual
            </div>
            <h1 className="text-[32px] sm:text-4xl lg:text-[44px] font-bold leading-[1.18] tracking-tight text-balance">
              Dapur Tenang, Dompet Senang.
            </h1>
            <p className="text-base sm:text-lg text-sakuText-muted leading-relaxed">
              SAKUPUAN membantu kamu mencatat pemasukan dan pengeluaran,
              memantau belanja kebutuhan pangan, serta memahami bagaimana
              perubahan harga pangan berkaitan dengan pengeluaran rumah
              tangga.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button onClick={() => openAuth("register")} className="inline-flex justify-center items-center gap-2 bg-sakuGreen hover:bg-sakuGreen-hover text-white font-semibold px-7 py-3.5 rounded-lg shadow-md transition-all active:scale-[0.98]">
                Mulai Kelola Keuangan <Arrow />
              </button>
              <a href="#cara-kerja" className="inline-flex justify-center items-center gap-2 text-sakuGreen hover:text-sakuGreen-hover font-semibold px-4 py-3">
                Pelajari Cara Kerjanya
                <svg className="w-4 h-4 animate-bounce text-sakuPink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
              </a>
            </div>
            <div className="pt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-sakuText-light font-medium border-t border-sakuGreen-light">
              <span className="flex items-center gap-1.5">
                <Check className="text-sakuPink"/>
                Bebas Pengisian Manual
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="text-sakuPink"/>
                Pencatatan Lewat Telegram
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="text-sakuPink"/>
                Disesuaikan Tren Pangan
              </span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="mx-auto max-w-lg lg:max-w-none bg-white rounded-2xl border border-sakuGreen-light shadow-floating p-4 sm:p-6 space-y-5">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sakuPink text-white flex items-center justify-center font-bold text-sm">
                    R
                  </div>
                  <div>
                    <p className="text-xs text-sakuText-light">
                      Ringkasan Dapur Ibu
                    </p>
                    <p className="text-sm font-semibold">
                      Periode Juni 2026
                    </p>
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs bg-sakuPink-light text-sakuPink-dark font-semibold px-2.5 py-1 rounded-md border border-sakuPink-border whitespace-nowrap">
                  Data Simulasi
                </span>
              </div>
              <div className="grid grid-cols-1 min-[400px]:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-sakuIvory border border-sakuGreen-light/80">
                  <p className="text-xs text-sakuText-muted font-medium">
                    Total Pengeluaran
                  </p>
                  <p className="text-base sm:text-lg font-bold text-sakuGreen mt-0.5">
                    Rp 5.250.000
                  </p>
                  <p className="text-[11px] text-sakuGreen font-medium mt-1 flex items-center gap-1">
                    <Check className="!w-3 !h-3"/>
                    Sesuai Target Bulanan
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-sakuPink-light/50 border border-sakuPink-border/60">
                  <p className="text-xs text-sakuText-muted font-medium">
                    Belanja Kebutuhan Pangan
                  </p>
                  <p className="text-base sm:text-lg font-bold text-sakuPink mt-0.5">
                    Rp 2.350.000
                  </p>
                  <p className="text-[11px] text-sakuPink-dark font-medium mt-1">
                    44.7% dari total anggaran
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                  <span className="font-semibold">
                    Tren Belanja Pangan vs Harga Komoditas
                  </span>
                  <span className="text-sakuText-light text-[11px]">
                    3 Bulan Terakhir
                  </span>
                </div>
                <div className="h-28 w-full relative">
                  <Line data={{
        labels: ["April", "Mei", "Juni"],
        datasets: [
            {
                label: "Belanja Pangan",
                data: [2100000, 2200000, 2350000],
                borderColor: "#1F5932",
                backgroundColor: "rgba(31,89,50,0.1)",
                fill: true,
                tension: 0.3,
                pointRadius: 3,
            },
            {
                label: "Indeks Harga",
                data: [1900000, 2050000, 2300000],
                borderColor: "#FF4B93",
                borderDash: [4, 4],
                tension: 0.3,
                pointRadius: 3,
            },
        ],
    }} options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 10 } },
            },
            y: { display: false },
        },
    }}/>
                </div>
                <div className="flex items-center justify-center gap-4 sm:gap-6 text-[11px] text-sakuText-muted pt-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sakuGreen"/>
                    Belanja Pangan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sakuPink"/>
                    Indeks Harga Pangan
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-sakuPink-light/70 border border-sakuPink-border text-xs text-sakuPink-dark flex items-start gap-2.5">
                <svg className="w-4 h-4 text-sakuPink shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>
                  <strong>Konteks Pangan:</strong> Belanja pangan naik 8%
                  pada bulan Juni bertepatan dengan lonjakan harga beras &
                  cabai merah nasional.
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
