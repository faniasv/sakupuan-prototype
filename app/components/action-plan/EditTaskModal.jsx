'use client';

import { useState } from 'react';
import Svg from '@/app/components/ui/Svg';
import { CAT_COLORS } from '@/lib/constants';

export default function EditTaskModal({ task, onSave, onClose, }) {
    const [title, setTitle] = useState(task.title);
    const [note, setNote] = useState(task.note ?? "");
    const [amount, setAmount] = useState(task.amount ? String(task.amount) : "");
    const [cat, setCat] = useState(task.cat);
    const label = "block text-xs font-semibold text-sakuText-muted mb-1.5";
    const field = "w-full text-base sm:text-sm px-4 py-3 rounded-xl bg-sakuIvory border border-sakuGreen-light focus:outline-none focus:border-sakuGreen focus:ring-1 focus:ring-sakuGreen";
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const save = async () => {
        if (!title.trim() || saving)
            return;
        const n = Number(amount);
        setSaving(true);
        setError("");
        try {
            await onSave({
            ...task,
            title: title.trim(),
            note: note.trim() || undefined,
            amount: n > 0 ? n : undefined,
            cat,
            });
        }
        catch (err) {
            setError(err.message);
            setSaving(false);
        }
    };
    return (<div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-sakuText/50 backdrop-blur-sm" onClick={onClose} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <form role="dialog" aria-modal="true" aria-labelledby="edit-task-title" onClick={(e) => e.stopPropagation()} onSubmit={(e) => {
            e.preventDefault();
            save();
        }} className="fade-up w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-floating max-h-[92dvh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 id="edit-task-title" className="text-lg font-extrabold text-sakuText">
            {task.id < 0 ? "Buat Action Baru" : "Ubah Rencana"}
          </h3>
          <button type="button" onClick={onClose} aria-label="Tutup" className="p-1.5 rounded-lg text-sakuText-light hover:bg-sakuGreen-light hover:text-sakuText">
            <Svg d={["M6 18 18 6", "M6 6l12 12"]} className="w-5 h-5"/>
          </button>
        </div>

        <div className="px-6 pb-2 space-y-4">
          <div>
            <label htmlFor="et-title" className={label}>
              Nama rencana
            </label>
            <input id="et-title" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} className={`${field} font-semibold`}/>
          </div>
          <div>
            <label htmlFor="et-note" className={label}>
              Konteks
            </label>
            <textarea id="et-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Kenapa rencana ini penting, kapan dilakukan, atau catatan lain" className={`${field} resize-none leading-relaxed`}/>
          </div>
          <div>
            <label htmlFor="et-amount" className={label}>
              Nominal
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-sakuText-light">
                Rp
              </span>
              <input id="et-amount" inputMode="numeric" value={amount ? Number(amount).toLocaleString("id-ID") : ""} onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 12))} placeholder="0" className={`${field} pl-11 font-semibold tabular-nums`}/>
            </div>
          </div>
          <fieldset>
            <legend className={label}>Kategori</legend>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CAT_COLORS).map(([c, color]) => {
            const on = cat === c;
            return (<button key={c} type="button" aria-pressed={on} onClick={() => setCat(c)} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border transition-colors ${on
                    ? ""
                    : "border-sakuGreen-light text-sakuText-muted hover:border-sakuGreen-border"}`} style={on
                    ? {
                        color,
                        borderColor: color,
                        backgroundColor: `${color}14`,
                    }
                    : undefined}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}/>
                    {c}
                  </button>);
        })}
            </div>
          </fieldset>
        </div>

        {error && (<p role="alert" className="px-6 pt-3 text-xs font-semibold text-sakuPink-dark">{error}</p>)}
        <div className="flex gap-2 px-6 pt-4 pb-6">
          <button type="button" onClick={onClose} className="flex-1 text-sm font-semibold text-sakuText-muted border border-sakuGreen-light hover:bg-sakuIvory py-3 rounded-2xl">
            Batal
          </button>
          <button type="submit" disabled={!title.trim() || saving} className="flex-1 text-sm font-bold text-white bg-sakuGreen hover:bg-sakuGreen-hover disabled:opacity-40 py-3 rounded-2xl">
            Simpan
          </button>
        </div>
      </form>
    </div>);
}
