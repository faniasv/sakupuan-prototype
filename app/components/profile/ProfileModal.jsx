'use client';

import { useState } from 'react';

export default function ProfileModal({ initial, onSave, onClose, }) {
    const [v, setV] = useState(initial);
    const [touched, setTouched] = useState(false);
    const errors = {
        name: !v.name.trim() ? "Nama wajib diisi" : "",
        email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())
            ? "Format email belum benar"
            : "",
        phone: v.phone && !/^(\+62|62|0)8\d{7,11}$/.test(v.phone.replace(/[\s-]/g, ""))
            ? "Contoh: 0812 3456 7890"
            : "",
    };
    const valid = !errors.name && !errors.email && !errors.phone;
    const [saving, setSaving] = useState(false);
    const [serverError, setServerError] = useState("");
    const submit = async () => {
        setSaving(true);
        setServerError("");
        try {
            await onSave({ name: v.name.trim(), email: v.email.trim(), phone: v.phone.trim() });
        }
        catch (err) {
            setServerError(err.message || "Gagal menyimpan profil");
            setSaving(false);
        }
    };
    const field = "w-full text-base sm:text-sm px-4 py-3 rounded-xl bg-sakuIvory border focus:outline-none focus:ring-1";
    const cls = (err) => `${field} ${touched && err
        ? "border-sakuPink focus:border-sakuPink focus:ring-sakuPink"
        : "border-sakuGreen-light focus:border-sakuGreen focus:ring-sakuGreen"}`;
    const rows = [
        {
            key: "name",
            label: "Nama",
            type: "text",
            placeholder: "Nama lengkap",
            auto: "name",
        },
        {
            key: "email",
            label: "Email",
            type: "email",
            placeholder: "nama@email.com",
            auto: "email",
            mode: "email",
        },
        {
            key: "phone",
            label: "Nomor handphone",
            type: "tel",
            placeholder: "0812 3456 7890",
            auto: "tel",
            mode: "tel",
        },
    ];
    return (<div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4 bg-sakuText/50 backdrop-blur-sm" onClick={onClose} onKeyDown={(e) => e.key === "Escape" && onClose()}>
      <form role="dialog" aria-modal="true" aria-labelledby="profile-title" onClick={(e) => e.stopPropagation()} onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (valid)
            submit();
        }} className="fade-up w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-floating max-h-[92dvh] overflow-y-auto" noValidate>
        <div className="flex items-center gap-3 px-6 pt-5 pb-4">
          <div className="w-12 h-12 rounded-full bg-sakuPink-light text-sakuPink flex items-center justify-center text-lg font-extrabold shrink-0">
            {v.name.trim()[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <h3 id="profile-title" className="text-lg font-extrabold text-sakuText leading-tight">
              Profil Puan
            </h3>
            <p className="text-xs text-sakuText-light">
              Lengkapi data diri untuk akun Saku Puan
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Tutup" className="ml-auto p-1.5 rounded-lg text-sakuText-light hover:bg-sakuGreen-light hover:text-sakuText">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round">
              <path d="M6 18 18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div className="px-6 space-y-4">
          {rows.map((r, i) => (<div key={r.key}>
              <label htmlFor={`pf-${r.key}`} className="block text-xs font-semibold text-sakuText-muted mb-1.5">
                {r.label}
                {r.key === "phone" && (<span className="font-normal text-sakuText-light">
                    {" "}
                    (opsional)
                  </span>)}
              </label>
              <input id={`pf-${r.key}`} type={r.type} inputMode={r.mode} autoComplete={r.auto} autoFocus={i === 0} value={v[r.key]} onChange={(e) => setV((p) => ({ ...p, [r.key]: e.target.value }))} placeholder={r.placeholder} aria-invalid={touched && !!errors[r.key]} className={cls(errors[r.key])}/>
              {touched && errors[r.key] && (<p className="text-[11px] text-sakuPink mt-1">
                  {errors[r.key]}
                </p>)}
            </div>))}
        </div>
        {serverError && (<p role="alert" className="px-6 pt-3 text-xs text-sakuPink-dark">{serverError}</p>)}
        <div className="flex gap-2 px-6 pt-5 pb-6">
          <button type="button" onClick={onClose} className="flex-1 text-sm font-semibold text-sakuText-muted border border-sakuGreen-light hover:bg-sakuIvory py-3 rounded-2xl">
            Batal
          </button>
          <button type="submit" disabled={saving} className="flex-1 text-sm font-bold text-white bg-sakuGreen hover:bg-sakuGreen-hover disabled:opacity-60 py-3 rounded-2xl">
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>);
}
