'use client';

import { Icons } from '@/app/components/ui/Icons';

export default function TelegramPrompt({ onConnect, onDismiss, }) {
    const setOpen = (_) => onDismiss();
    return (<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-sakuText/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div role="dialog" aria-modal="true" aria-labelledby="tg-prompt-title" onClick={(e) => e.stopPropagation()} className="fade-up w-full max-w-sm bg-white rounded-3xl p-6 shadow-floating text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-sakuPink-light text-sakuPink flex items-center justify-center mx-auto">
          <Icons.Telegram className="w-7 h-7"/>
        </div>
        <div className="space-y-1.5">
          <h3 id="tg-prompt-title" className="text-lg font-extrabold text-sakuText">
            Sambungkan Telegram
          </h3>
          <p className="text-sm text-sakuText-muted leading-relaxed">
            Biar catat belanja dapur otomatis, cukup kirim pesan singkat ke Saku
            Puan Bot.
          </p>
        </div>
        <div className="space-y-2">
          <button onClick={onConnect} className="w-full flex items-center justify-center gap-2 bg-sakuGreen hover:bg-sakuGreen-hover text-white text-sm font-bold py-3.5 rounded-2xl">
            <Icons.Telegram className="w-4 h-4"/> Sambungkan Sekarang
          </button>
          <button onClick={() => setOpen(false)} className="w-full text-sm font-semibold text-sakuText-light hover:text-sakuText py-2.5">
            Ingatkan Nanti
          </button>
        </div>
      </div>
    </div>);
}
