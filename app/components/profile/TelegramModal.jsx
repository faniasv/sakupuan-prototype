"use client";

import { Icons } from "../ui/Icons";

export default function TelegramModal({ open, onConnect, onDismiss }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sakuText/60 backdrop-blur-sm fade-up"
      onClick={onDismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-floating text-center space-y-5"
      >
        <div className="w-14 h-14 rounded-full bg-sakuPink-light text-sakuPink flex items-center justify-center mx-auto shadow-sm">
          <Icons.Telegram className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-sakuText tracking-tight">
            Sambungkan Telegram
          </h3>
          <p className="text-xs text-sakuText-muted leading-relaxed">
            Biar catat belanja dapur otomatis, cukup kirim pesan singkat ke Saku Puan Bot.
          </p>
        </div>
        <div className="space-y-2.5 pt-1">
          <button
            onClick={onConnect}
            className="w-full flex items-center justify-center gap-2 bg-sakuGreen hover:bg-sakuGreen-hover text-white text-xs font-bold py-3.5 rounded-2xl shadow-md transition-transform active:scale-98"
          >
            <Icons.Telegram className="w-4 h-4" /> Sambungkan Sekarang
          </button>
          <button
            onClick={onDismiss}
            className="w-full text-xs font-semibold text-sakuText-light hover:text-sakuText py-2"
          >
            Ingatkan Nanti
          </button>
        </div>
      </div>
    </div>
  );
}