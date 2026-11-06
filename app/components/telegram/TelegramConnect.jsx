'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/app/components/providers/AppProvider';
import { Icons } from '@/app/components/ui/Icons';
import { api } from '@/lib/api';

const BOT = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'saku_puan_bot';

export default function TelegramConnect() {
  const router = useRouter();
  const { user, refreshUser } = useApp();
  const [opening, setOpening] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState('');

  // 1) ask the server for a one-time deeplink, 2) open it, 3) poll until the bot confirms
  const connect = async () => {
    setOpening(true);
    setError('');
    try {
      const { deeplink } = await api.post('/api/telegram/link');
      window.open(deeplink, '_blank', 'noopener,noreferrer');
      setWaiting(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setOpening(false);
    }
  };

  useEffect(() => {
    if (!waiting || user?.telegramConnected) return;
    const id = setInterval(() => refreshUser().catch(() => {}), 3000);
    const stop = setTimeout(() => setWaiting(false), 15 * 60_000);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [waiting, user?.telegramConnected, refreshUser]);

  return (
    <div className="max-w-md mx-auto space-y-5 fade-up">
                <div className="flex items-center gap-2">
                  <button onClick={() => router.push("/dashboard")} aria-label="Kembali" className="p-2 -ml-2 rounded-xl text-sakuText hover:bg-sakuGreen-light">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                  </button>
                  <h2 className="text-base font-bold text-sakuText">
                    Sambungkan Telegram
                  </h2>
                </div>

                <div className="bg-white rounded-3xl shadow-soft border border-sakuGreen-light p-6 text-center space-y-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sakuGreen bg-sakuGreen-light px-3 py-1 rounded-full">
                    <Icons.Bot className="w-3.5 h-3.5"/> Saku Puan Bot Resmi
                  </span>
                  <div className="w-16 h-16 rounded-full bg-sakuPink-light text-sakuPink flex items-center justify-center mx-auto">
                    <Icons.Telegram className="w-8 h-8"/>
                  </div>
                  <h3 className="text-xl font-extrabold text-sakuText tracking-tight">
                    Pencatatan Otomatis Tanpa Ribet!
                  </h3>
                  <p className="text-[13px] text-sakuText-muted leading-relaxed">
                    Tinggal sekali klik untuk membuka Telegram Bot. Catat belanjaan
                    dapur cukup kirim pesan singkat kayak chat ke teman!
                  </p>
                  {user.telegramConnected && (<p className="text-xs font-semibold text-sakuGreen bg-sakuGreen-light rounded-xl py-2">
                      Telegram sudah terhubung
                    </p>)}
                </div>

                <div className="space-y-2">
                  <button onClick={connect} disabled={opening} className="w-full flex items-center justify-center gap-2 bg-sakuPink hover:bg-sakuPink-hover disabled:opacity-60 text-white text-sm font-bold py-4 rounded-2xl shadow-floating transition-transform active:scale-[0.98]">
                <Icons.Telegram className="w-5 h-5"/>
                {opening ? "Menyiapkan tautan..." : "Buka Telegram & Hubungkan Otomatis"}
              </button>
              {error && <p role="alert" className="text-xs font-semibold text-sakuPink-dark text-center">{error}</p>}
              {waiting && !user.telegramConnected && <p className="text-xs text-sakuText-muted text-center">Menunggu konfirmasi dari Telegram... tekan Start di bot ya, Puan.</p>}
                  <p className="text-[11px] text-sakuText-muted text-center">Menghubungkan langsung ke t.me/{BOT}</p>
                </div>

                <button onClick={() => router.push("/dashboard")} className="w-full border border-sakuGreen text-sakuGreen hover:bg-sakuGreen-light text-sm font-semibold py-3.5 rounded-2xl transition-colors">
                  Kembali ke Dashboard Utama
                </button>
              </div>
  );
}
