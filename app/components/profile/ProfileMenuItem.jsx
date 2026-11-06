"use client";

export default function ProfileMenuItem({ icon, label, desc, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-4 rounded-2xl bg-white border border-sakuGreen-light shadow-soft hover:border-sakuGreen transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-sakuGreen-light text-sakuGreen flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-sakuText group-hover:text-sakuGreen transition-colors">
            {label}
          </p>
          <p className="text-[11px] text-sakuText-muted mt-0.5">{desc}</p>
        </div>
      </div>
      <svg className="w-5 h-5 text-sakuText-light group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}