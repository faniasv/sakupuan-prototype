'use client';

import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useApp } from '@/app/components/providers/AppProvider';
import { jt, rb, rp } from '@/lib/format';
import { useFetch } from '@/lib/useFetch';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const HORIZONS = [
    { id: 1, label: '1 Bulan', history: 3 },
    { id: 6, label: '6 Bulan', history: 6 },
    { id: 12, label: '1 Tahun', history: 6 },
];
// ---------- Harga pangan (pola SP2KP Kemendag, 30 hari terakhir) ----------
// Label for day `offset` relative to the last actual price (asOf = "YYYY-MM-DD").
const dayLabel = (asOf, offset) => {
    const d = new Date(`${asOf}T12:00:00`);
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};
const SparklesIcon = ({ className = 'w-5 h-5' }) => (<svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16 2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
  </svg>);
const tooltipBase = { backgroundColor: '#1E2D24', padding: 10, cornerRadius: 12, titleFont: { weight: 'bold' }, boxPadding: 4 };
const axisTicks = { color: '#6E8276', font: { size: 10, family: 'Inter' } };
export default function Forecast() {
    const { city } = useApp();
    const [horizon, setHorizon] = useState(12);
    const [showScenario, setShowScenario] = useState(false);
    const [commodityId, setCommodityId] = useState('cabai');
    const balRes = useFetch('/api/forecast/balance');
    const priceRes = useFetch(`/api/forecast/prices?commodity=${commodityId}&city=${encodeURIComponent(city)}`);
    if (!balRes.data || !priceRes.data) {
        return (<p className="text-center text-sm text-sakuText-light py-20">
          {balRes.error || priceRes.error ? 'Gagal memuat prediksi. Coba muat ulang halaman.' : 'Memuat prediksi...'}
        </p>);
    }
    const { history: HISTORY, futureLabels: ALL_FUTURE, base: ALL_BASE, scenario: ALL_SCENARIO } = balRes.data;
    const COMMODITIES = priceRes.data.commodities;
    // Chart 1
    const h = HORIZONS.find((x) => x.id === horizon);
    const hist = HISTORY.slice(-h.history);
    const futureLabels = ALL_FUTURE.slice(0, horizon);
    const base = ALL_BASE.slice(0, horizon);
    const scenario = ALL_SCENARIO.slice(0, horizon);
    const lastActual = hist.length - 1;
    const endValue = base[base.length - 1];
    const current = HISTORY[HISTORY.length - 1].value;
    const balanceData = {
        labels: [...hist.map((x) => x.label), ...futureLabels],
        datasets: [
            {
                label: 'Proyeksi saldo',
                data: [...hist.map((x) => x.value), ...base],
                borderColor: '#1F5932',
                backgroundColor: 'rgba(31, 89, 50, 0.08)',
                fill: 'start',
                tension: 0.35,
                borderWidth: 2.5,
                segment: { borderDash: (ctx) => (ctx.p0DataIndex >= lastActual ? [6, 5] : undefined) },
                pointRadius: (ctx) => (ctx.dataIndex === lastActual || ctx.dataIndex === lastActual + horizon ? 4 : 0),
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#1F5932',
                pointBorderWidth: 2,
                pointHoverRadius: 5,
            },
            ...(showScenario
                ? [{
                        label: 'Skenario hemat dapur',
                        data: [...hist.map((x, i) => (i === lastActual ? x.value : null)), ...scenario],
                        borderColor: '#FF4B93',
                        borderDash: [6, 5],
                        borderWidth: 2.5,
                        tension: 0.35,
                        pointRadius: (ctx) => (ctx.dataIndex === lastActual + horizon ? 4 : 0),
                        pointBackgroundColor: '#FFFFFF',
                        pointBorderColor: '#FF4B93',
                        pointBorderWidth: 2,
                        fill: false,
                    }]
                : []),
        ],
    };
    const balanceOptions = {
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { tooltip: { ...tooltipBase, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${rp(ctx.parsed.y ?? 0)}` } } },
        scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { ...axisTicks, maxRotation: 0, autoSkip: true, maxTicksLimit: 7 } },
            y: { grid: { color: '#EAF3EC' }, border: { display: false }, ticks: { ...axisTicks, maxTicksLimit: 5, callback: (v) => jt(Number(v)) } },
        },
    };
    // Chart 2
    const s = priceRes.data.series;
    const commodity = s.commodity;
    const series = { ...s, fit: (x) => s.intercept + s.slope * x };
    const change = ((series.projected - series.today) / series.today) * 100;
    const extraMonthly = (series.projected - series.today) * commodity.monthlyQty;
    const priceData = {
        labels: Array.from({ length: 60 }, (_, i) => dayLabel(s.asOf, i - 29)),
        datasets: [
            {
                label: 'Harga aktual',
                data: series.actual,
                borderColor: commodity.color,
                backgroundColor: `${commodity.color}14`,
                fill: 'start',
                tension: 0.3,
                borderWidth: 2.5,
                pointRadius: 0,
                pointHoverRadius: 4,
            },
            {
                label: 'Proyeksi regresi',
                data: Array.from({ length: 60 }, (_, x) => (x < 29 ? null : Math.round(series.fit(x)))),
                borderColor: commodity.color,
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: (ctx) => (ctx.dataIndex === 59 ? 4 : 0),
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: commodity.color,
                pointBorderWidth: 2,
                fill: false,
            },
        ],
    };
    const priceOptions = {
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { tooltip: { ...tooltipBase, callbacks: { label: (ctx) => (ctx.parsed.y == null ? '' : ` ${ctx.dataset.label}: ${rp(ctx.parsed.y)}/${commodity.unit}`) } } },
        scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { ...axisTicks, maxRotation: 0, autoSkip: true, maxTicksLimit: 6 } },
            y: { grid: { color: '#EAF3EC' }, border: { display: false }, ticks: { ...axisTicks, maxTicksLimit: 5, callback: (v) => rb(Number(v)) } },
        },
    };
    const card = 'bg-white rounded-3xl border border-sakuGreen-light p-5';
    return (<div className="max-w-xl mx-auto lg:max-w-none grid gap-4 lg:grid-cols-2 lg:gap-6 items-start fade-up">
      <header className="lg:col-span-2">
        <h2 className="text-xl font-extrabold tracking-tight text-sakuText">Prediksi Keuangan & Trend Pangan</h2>
        <p className="text-xs text-sakuText-muted mt-1">Perkiraan saldo dan harga bahan dapur di {city}, biar bisa siap-siap dari sekarang.</p>
      </header>

      <div className="space-y-4">
        {/* Chart 1 — Proyeksi saldo */}
        <section className={card}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-sakuText">Proyeksi Saldo</h3>
              <p className="text-[11px] text-sakuText-light">Berdasarkan rata-rata sisa uang Puan per bulan</p>
            </div>
            <div role="tablist" aria-label="Rentang proyeksi" className="flex shrink-0 p-1 bg-sakuIvory rounded-full">
              {HORIZONS.map((x) => (<button key={x.id} role="tab" aria-selected={horizon === x.id} onClick={() => setHorizon(x.id)} className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-colors ${horizon === x.id ? 'bg-sakuGreen text-white' : 'text-sakuText-muted hover:text-sakuGreen'}`}>
                  {x.label}
                </button>))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-sakuIvory px-3 py-2.5">
              <p className="text-[11px] text-sakuText-light">Saldo sekarang</p>
              <p className="text-[15px] font-extrabold text-sakuText tabular-nums">{rp(current)}</p>
            </div>
            <div className="rounded-2xl bg-sakuGreen-light px-3 py-2.5">
              <p className="text-[11px] text-sakuGreen">Proyeksi {futureLabels[futureLabels.length - 1]}</p>
              <p className="text-[15px] font-extrabold text-sakuGreen tabular-nums">{rp(endValue)}</p>
            </div>
          </div>

          <div className="relative h-52 mt-4">
            <Line data={balanceData} options={balanceOptions} aria-label="Grafik proyeksi saldo"/>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-sakuText-muted">
            <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-sakuGreen"/>Aktual</span>
            <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-sakuGreen"/>Proyeksi</span>
            {showScenario && <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-sakuPink"/>Skenario hemat</span>}
          </div>
        </section>
      </div>

      {/* Chart 2 — Trend harga pangan */}
      <section className={card}>
        <div>
          <h3 className="text-base font-extrabold text-sakuText">Trend Harga Pangan</h3>
          <p className="text-[11px] text-sakuText-light">Proyeksi 30 hari (regresi linear) dari data harga Kemendag, {city}</p>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
          {COMMODITIES.map((c) => (<button key={c.id} onClick={() => setCommodityId(c.id)} aria-pressed={commodityId === c.id} className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-colors ${commodityId === c.id ? 'bg-sakuText text-white border-sakuText' : 'bg-white text-sakuText-muted border-sakuGreen-light hover:border-sakuGreen-border'}`}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }}/>
              {c.name}
            </button>))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-sakuIvory px-2 py-2.5">
            <p className="text-[10px] text-sakuText-light">Hari ini</p>
            <p className="text-sm font-extrabold text-sakuText tabular-nums">{rp(series.today)}</p>
          </div>
          <div className="rounded-2xl bg-sakuIvory px-2 py-2.5">
            <p className="text-[10px] text-sakuText-light">30 hari lagi</p>
            <p className="text-sm font-extrabold text-sakuText tabular-nums">{rp(series.projected)}</p>
          </div>
          <div className={`rounded-2xl px-2 py-2.5 ${change > 0.5 ? 'bg-sakuPink-light text-sakuPink-dark' : change < -0.5 ? 'bg-sakuGreen-light text-sakuGreen' : 'bg-sakuIvory text-sakuText'}`}>
            <p className="text-[10px] opacity-80">Perubahan</p>
            <p className="text-sm font-extrabold tabular-nums">{change > 0 ? '+' : ''}{change.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%</p>
          </div>
        </div>

        <div className="relative h-52 mt-4">
          <Line data={priceData} options={priceOptions} aria-label={`Grafik trend harga ${commodity.name}`}/>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-sakuText-muted">
          <span className="flex items-center gap-1.5"><span className="w-4 border-t-2" style={{ borderColor: commodity.color }}/>30 hari terakhir</span>
          <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed" style={{ borderColor: commodity.color }}/>Proyeksi 30 hari</span>
        </div>

        <p className="mt-4 rounded-2xl bg-sakuIvory px-4 py-3 text-xs text-sakuText leading-relaxed">
          {Math.abs(extraMonthly) < 1000
            ? <>Harga <b>{commodity.name}</b> diperkirakan stabil, belanja dapur Puan aman.</>
            : extraMonthly > 0
                ? <>Kalau tren ini lanjut, belanja <b>{commodity.name}</b> ({commodity.monthlyQty} {commodity.unit}/bulan) bisa nambah sekitar <b className="text-sakuPink-dark">{rp(extraMonthly)}</b> per bulan.</>
                : <>Harga <b>{commodity.name}</b> cenderung turun, Puan bisa hemat sekitar <b className="text-sakuGreen">{rp(-extraMonthly)}</b> per bulan.</>}
        </p>
        <p className="mt-2 text-[10px] text-sakuText-light">Kemiringan tren: {series.slope >= 0 ? '+' : '-'}{rp(Math.abs(series.slope))}/hari · Sumber pola: SP2KP Kemendag{s.source === 'simulated' ? ' (data simulasi)' : ''}</p>
      </section>
    </div>);
}
