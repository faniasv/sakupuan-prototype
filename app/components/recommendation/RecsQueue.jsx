"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/app/components/providers/AppProvider";
import Svg from "@/app/components/ui/Svg";
import { api } from "@/lib/api";
import { GROUPS } from "@/lib/data/recommendations";

const S = (props) => <Svg strokeWidth={2.2} {...props} />;
const BULB = ["M9 18h6", "M10 22h4", "M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"];
const CHECK = ["M5 12.5l4.5 4.5L19 7"];
const X = ["M6 18 18 6", "M6 6l12 12"];
const SPARK = ["M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z", "M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"];

export default function RecsQueue() {
  const router = useRouter();
  const { city, tasks, addTask } = useApp();
  const [data, setData] = useState(null); // { recs, skipped, poolLeft }
  const [loadError, setLoadError] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selected, setSelected] = useState([]); // empty = Semua
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let off = false;
    api
      .get(`/api/recommendations?city=${encodeURIComponent(city)}`)
      .then((r) => !off && setData(r))
      .catch((e) => !off && setLoadError(e.message));
    return () => {
      off = true;
    };
  }, [city]);

  if (!data) {
    return <p className="text-center text-sm text-sakuText-light py-20">{loadError || "Memuat rekomendasi..."}</p>;
  }

  const { recs, skipped, poolLeft } = data;
  const exhausted = poolLeft === 0;
  const inPlan = (r) => tasks.some((t) => t.title === r.task.title);
  const pending = recs.filter((r) => !skipped.includes(r.id) && !inPlan(r));
  const visible = pending.filter((r) => selected.length === 0 || selected.includes(r.group));

  const toggleGroup = (g) =>
    setSelected((s) => {
      const next = s.includes(g) ? s.filter((x) => x !== g) : [...s, g];
      return next.length === GROUPS.length ? [] : next;
    });

  const approve = async (r) => {
    try {
      await addTask(r.task);
      setToast({ text: "Ditambahkan ke Action Plan", plan: true });
    } catch (e) {
      setToast({ text: e.message });
    }
  };
  const skip = (r) => {
    setData((d) => ({ ...d, skipped: [...d.skipped, r.id] }));
    setToast({ text: "Saran dilewati", undo: r.id });
    api.patch(`/api/recommendations/${r.id}`, { action: "skip" }).catch(() => {});
  };
  const undo = (id) => {
    setData((d) => ({ ...d, skipped: d.skipped.filter((x) => x !== id) }));
    setToast(null);
    api.patch(`/api/recommendations/${id}`, { action: "undo" }).catch(() => {});
  };
  const generate = async () => {
    if (generating || exhausted) return;
    setGenerating(true);
    setToast(null);
    try {
      const r = await api.post("/api/recommendations/generate", { city });
      setData({ recs: r.recs, skipped: r.skipped, poolLeft: r.poolLeft });
      setSelected([]);
      setToast({ text: `${r.added} saran baru dari Mimin` });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setToast({ text: e.message });
    } finally {
      setGenerating(false);
    }
  };

  const chip = (on) =>
    `shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border transition-colors ${on ? "bg-sakuGreen border-sakuGreen text-white" : "bg-white border-sakuGreen-light text-sakuText-muted hover:border-sakuGreen-border"}`;

  return (
    <div className="max-w-xl mx-auto fade-up">
      <header className="space-y-2.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sakuPink bg-sakuPink-light border border-sakuPink-border px-3 py-1 rounded-full">
          <S d={BULB} className="w-3.5 h-3.5" /> Rekomendasi PUAN AI
        </span>
        <h2 className="text-xl font-extrabold text-sakuText tracking-tight">Rekomendasi Aksi Dapur</h2>
        <p className="text-xs text-sakuText-muted leading-relaxed max-w-sm">Setujui saran hemat & alokasi anggaran yang sesuai dengan kebutuhan dapurmu!</p>
      </header>

      <div className="flex gap-2 overflow-x-auto -mx-4 px-4 py-4 [scrollbar-width:none]" role="group" aria-label="Filter kategori">
        <button aria-pressed={selected.length === 0} onClick={() => setSelected([])} className={chip(selected.length === 0)}>
          {selected.length === 0 && <S d={CHECK} className="w-3.5 h-3.5" />}
          Semua ({pending.length})
        </button>
        {GROUPS.map((g) => {
          const on = selected.includes(g.id);
          return (
            <button key={g.id} aria-pressed={on} onClick={() => toggleGroup(g.id)} className={chip(on)}>
              {on && <S d={CHECK} className="w-3.5 h-3.5" />}
              {g.label}
            </button>
          );
        })}
      </div>

      <ul className="space-y-3">
        {visible.map((r) => (
          <li key={r.id} className="fade-up bg-white rounded-[20px] p-4 space-y-3 border border-sakuGreen">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider truncate text-sakuGreen">{r.tag}</span>
              <span className="shrink-0 text-[11px] font-bold text-sakuGreen bg-sakuGreen-light px-2.5 py-1 rounded-full">{r.impact}</span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-extrabold text-sakuText leading-snug">{r.title}</h3>
              <p className="text-xs text-sakuText-muted leading-relaxed">{r.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button onClick={() => skip(r)} className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-sakuText-muted border border-sakuText-muted hover:bg-sakuIvory py-2.5 rounded-xl transition-colors">
                <S d={X} className="w-3.5 h-3.5" /> Lewati
              </button>
              <button onClick={() => approve(r)} className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-sakuGreen hover:bg-sakuGreen-hover py-2.5 rounded-xl transition-colors active:scale-[0.98]">
                <S d={CHECK} className="w-3.5 h-3.5" /> Setujui & Tambah
              </button>
            </div>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <div className="text-center py-10 px-6 bg-white rounded-[20px] border border-dashed border-sakuGreen-border space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sakuGreen-light text-sakuGreen flex items-center justify-center mx-auto">
            <S d={CHECK} className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-sakuText">{pending.length === 0 ? "Semua saran sudah ditinjau" : "Tidak ada saran di kategori ini"}</p>
            <p className="text-xs text-sakuText-light mt-1">Mimin akan kirim saran baru saat ada perubahan harga atau pola belanja.</p>
          </div>
          {pending.length === 0 && (
            <button onClick={() => router.push("/action-plan")} className="text-xs font-bold text-sakuGreen hover:underline">
              Lihat Action Plan
            </button>
          )}
        </div>
      )}

      <div className="mt-6 space-y-2">
        {toast && (
          <div role="status" className="fade-up flex items-center justify-between gap-3 bg-sakuText text-white text-xs font-semibold pl-4 pr-2 py-2 rounded-xl shadow-floating">
            <span>{toast.text}</span>
            <span className="flex items-center gap-1">
              {toast.plan && (
                <button onClick={() => router.push("/action-plan")} className="text-sakuGreen-border hover:text-white px-2 py-1">
                  Lihat
                </button>
              )}
              {toast.undo && (
                <button onClick={() => undo(toast.undo)} className="text-sakuPink-border hover:text-white px-2 py-1">
                  Urungkan
                </button>
              )}
              <button onClick={() => setToast(null)} aria-label="Tutup" className="p-1 text-white/60 hover:text-white">
                <S d={X} className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}
        <button
          onClick={generate}
          disabled={generating || exhausted}
          aria-busy={generating}
          className="w-full flex items-center justify-center gap-2 bg-sakuPink hover:bg-sakuPink-hover disabled:bg-sakuPink/60 disabled:cursor-not-allowed text-white text-sm font-bold py-3.5 rounded-full shadow-floating transition-colors active:scale-[0.99]"
        >
          {generating ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Mimin sedang menyusun saran...
            </>
          ) : (
            <>
              <S d={SPARK} className="w-4 h-4" />
              {exhausted ? "Semua saran terbaru sudah ditampilkan" : "Generate rekomendasi"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
