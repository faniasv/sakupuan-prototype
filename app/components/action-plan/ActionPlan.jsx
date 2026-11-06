'use client';

import { useState } from 'react';
import { useApp } from '@/app/components/providers/AppProvider';
import Svg from '@/app/components/ui/Svg';
import { CAT_COLORS } from '@/lib/constants';
import { rp } from '@/lib/format';
import EditTaskModal from './EditTaskModal';

const PENCIL = ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"];
const TRASH = [
    "M3 6h18",
    "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6",
];
const CHECK = ["M5 12.5l4.5 4.5L19 7"];
export default function ActionPlan() {
    const { tasks, toggleTask, removeTask, saveTask } = useApp();
    const [filter, setFilter] = useState("all");
    const [editing, setEditing] = useState(null);
    const doneCount = tasks.filter((t) => t.done).length;
    const tabs = [
        { id: "all", label: "Semua", count: tasks.length },
        { id: "open", label: "Belum Selesai", count: tasks.length - doneCount },
        { id: "done", label: "Selesai", count: doneCount },
    ];
    const visible = tasks.filter((t) => filter === "all" ? true : filter === "done" ? t.done : !t.done);
    const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
    const toggle = toggleTask;
    const remove = removeTask;
    const saveEdit = async (next) => {
        // id < 0 marks a brand-new task created from the "Buat action baru" button.
        await saveTask(next); // throws on failure so the modal can show the error
        setEditing(null);
    };
    return (<div className="max-w-xl mx-auto space-y-5 fade-up">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-sakuText tracking-tight">
            Action Plan
          </h2>
          <span className="block text-sm text-sakuText-muted mt-1 leading-relaxed">
            Daftar langkah kecil untuk memperbaiki keuangan dapur.
          </span>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-extrabold text-sakuGreen leading-none">
            {doneCount}/{tasks.length}
          </p>
          <p className="text-[11px] text-sakuText-light mt-1">selesai</p>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-sakuGreen-light overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-sakuGreen rounded-full transition-all duration-500" style={{ width: `${pct}%` }}/>
      </div>

      <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1" role="tablist">
        {tabs.map((t) => (<button key={t.id} role="tab" aria-selected={filter === t.id} onClick={() => setFilter(t.id)} className={`shrink-0 text-sm px-4 py-2 rounded-full border transition-colors ${filter === t.id
                ? "bg-sakuGreen border-sakuGreen text-white font-semibold"
                : "bg-white border-sakuGreen-light text-sakuText-muted hover:border-sakuGreen-border"}`}>
            {t.label} ({t.count})
          </button>))}
      </div>

      <ul className="space-y-3">
        {visible.map((t) => {
            const color = CAT_COLORS[t.cat] ?? "#8A9A90";
            return (<li key={t.id} className={`fade-up bg-white rounded-[20px] border p-4 flex items-start gap-3 transition-colors ${t.done
                    ? "border-sakuGreen-light bg-white/70"
                    : "border-sakuGreen-light hover:shadow-card"}`}>
              <button onClick={() => toggle(t.id)} role="checkbox" aria-checked={t.done} aria-label={t.done
                    ? `Tandai belum selesai: ${t.title}`
                    : `Tandai selesai: ${t.title}`} className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${t.done
                    ? "bg-sakuGreen border-sakuGreen text-white"
                    : "border-sakuGreen-border hover:border-sakuGreen text-transparent"}`}>
                <Svg d={CHECK} className="w-3.5 h-3.5"/>
              </button>

              <div className="flex-1 min-w-0">
                <p className={`text-[15px] font-semibold leading-snug ${t.done
                    ? "text-sakuText-light line-through"
                    : "text-sakuText"}`}>
                  {t.title}
                </p>
                {t.note && (<p className="text-xs text-sakuText-light mt-1 leading-relaxed line-clamp-2">
                    {t.note}
                  </p>)}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${t.done ? "line-through opacity-70" : ""}`} style={{ color, backgroundColor: `${color}14` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}/>
                    {t.cat}
                  </span>
                  {t.amount && (<span className={`text-xs font-bold tabular-nums ${t.done ? "text-sakuText-light" : "text-sakuText"}`}>
                      {rp(t.amount)}
                    </span>)}
                </div>
              </div>

              <div className="flex items-center gap-0.5 shrink-0 -mr-1">
                <button onClick={() => setEditing(t)} aria-label={`Ubah ${t.title}`} className="p-2 rounded-lg text-sakuText-light hover:bg-sakuGreen-light hover:text-sakuGreen">
                  <Svg d={PENCIL}/>
                </button>
                <button onClick={() => remove(t.id)} aria-label={`Hapus ${t.title}`} className="p-2 rounded-lg text-sakuText-light hover:bg-sakuPink-light hover:text-sakuPink">
                  <Svg d={TRASH}/>
                </button>
              </div>
            </li>);
        })}
      </ul>

      {editing && (<EditTaskModal task={editing} onSave={saveEdit} onClose={() => setEditing(null)}/>)}

      {visible.length === 0 && (<div className="text-center py-10 px-6 bg-white rounded-[20px] border border-dashed border-sakuGreen-border">
          <p className="text-sm font-semibold text-sakuText">
            {filter === "done"
                ? "Belum ada yang selesai"
                : filter === "open"
                    ? "Semua tugas sudah beres, mantap Puan!"
                    : "Action Plan masih kosong"}
          </p>
          <p className="text-xs text-sakuText-light mt-1">
            Buat action baru lewat tombol di bawah.
          </p>
        </div>)}

      <button onClick={() => setEditing({
            id: -1,
            title: "",
            cat: Object.keys(CAT_COLORS)[0],
            done: false,
        })} className="w-full text-sm font-semibold text-sakuGreen border border-sakuGreen-border hover:bg-sakuGreen-light py-3.5 rounded-2xl transition-colors">
        + Buat action baru
      </button>
    </div>);
}
