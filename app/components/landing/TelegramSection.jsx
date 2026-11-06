'use client';

import { useEffect, useRef, useState } from 'react';
import { Arrow, Check, Container } from './primitives';

const INITIAL_MSGS = [
  { id: 1, from: "user", text: "Gaji 2.000.000", time: "09:15" },
  { id: 2, from: "bot", text: "", type: "pemasukan", cat: "Pemasukan Utama", time: "09:15" },
  { id: 3, from: "user", text: "Belanja sayur 35.000", time: "10:42" },
  { id: 4, from: "bot", text: "", type: "pengeluaran", cat: "Belanja Pangan", time: "10:42" },
];

export default function TelegramSection({ openAuth, onOpenGuide }) {
  const [msgs, setMsgs] = useState(INITIAL_MSGS);
  const chatRef = useRef(null);
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);
  // Simulated bot: echoes a "recorded" confirmation after a short delay.
  const send = (text, type, cat) => {
    const d = new Date();
    const time = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    setMsgs((m) => [...m, { id: Date.now(), from: "user", text, time }]);
    setTimeout(() => setMsgs((m) => [...m, { id: Date.now() + 1, from: "bot", text: "", type, cat, time }]), 600);
  };
  return (
    <section id="panduan" className="scroll-mt-20 py-14 sm:py-16 bg-white border-y border-sakuGreen-light/60">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sakuPink">
                Fitur Kemudahan Telegram
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">
                Catat Pengeluaran Lewat Telegram.
              </h2>
              <p className="text-base text-sakuText-muted mt-2">
                Gunakan percakapan sederhana untuk mencatat transaksi dan
                membantu memperbarui ringkasan keuanganmu.
              </p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {[
        [
            "Daftar dan Selesaikan Onboarding",
            "Buat akun Saku Puan dan lengkapi informasi yang diperlukan.",
        ],
        [
            "Hubungkan Telegram",
            "Ikuti instruksi penghubungan Telegram dari dalam aplikasi Saku Puan.",
        ],
        [
            "Mulai Catat Transaksi",
            "Kirim catatan transaksi menggunakan format yang dipandu bot.",
        ],
    ].map(([t, d], i) => (<div key={t} className="p-4 rounded-xl bg-sakuIvory border border-sakuGreen-light flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-sakuGreen text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{t}</h4>
                    <p className="text-xs text-sakuText-muted mt-1">{d}</p>
                  </div>
                </div>))}
            </div>
            <button onClick={() => openAuth("register")} className="inline-flex items-center gap-2 text-sm font-semibold text-sakuGreen hover:text-sakuGreen-hover underline underline-offset-4">
              Hubungkan Telegram Sekarang{" "}
              <Arrow className="w-4 h-4 text-sakuPink"/>
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="max-w-md mx-auto rounded-3xl bg-gray-900 p-2.5 sm:p-3 shadow-2xl border-4 border-gray-800">
              <div className="bg-[#17212B] text-white px-4 py-3 rounded-t-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sakuGreen flex items-center justify-center font-bold text-xs border border-sakuGreen-border">
                    SP
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-none flex items-center gap-1">
                      SAKUPUAN Bot{" "}
                      <Check className="!w-3.5 !h-3.5 text-sakuPink"/>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      bot resmi • online
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-gray-800 text-sakuPink-light px-2 py-1 rounded border border-sakuPink/30">
                  Simulasi
                </span>
              </div>
              <div ref={chatRef} className="bg-[#0E1621] p-4 h-72 sm:h-80 overflow-y-auto space-y-3.5 text-xs">
                <div className="text-center my-1">
                  <span className="bg-[#182533] text-gray-400 text-[10px] px-2.5 py-1 rounded-full">
                    Hari ini
                  </span>
                </div>
                {msgs.map((m) => m.from === "user" ? (<div key={m.id} className="flex justify-end fade-up">
                      <div className="chat-bubble-user max-w-[80%] p-2.5 rounded-2xl">
                        <p>{m.text}</p>
                        <span className="text-[9px] text-emerald-100 block text-right mt-1">
                          {m.time}
                        </span>
                      </div>
                    </div>) : (<div key={m.id} className="flex justify-start fade-up">
                      <div className="chat-bubble-bot max-w-[85%] p-2.5 rounded-2xl">
                        <p className={`font-semibold flex items-center gap-1 ${m.type === "pengeluaran"
            ? "text-sakuPink"
            : "text-sakuGreen"}`}>
                          <Check className="!w-3.5 !h-3.5"/>
                          Catatan {m.type} berhasil ditambahkan.
                        </p>
                        <p className="text-[11px] text-gray-600 mt-1">
                          Kategori:{" "}
                          <span className="font-semibold text-gray-800">
                            {m.cat}
                          </span>
                        </p>
                        <span className="text-[9px] text-gray-400 block text-right mt-1">
                          {m.time}
                        </span>
                      </div>
                    </div>))}
              </div>
              <div className="bg-[#17212B] p-2.5 rounded-b-2xl border-t border-gray-800">
                <p className="text-[10px] text-gray-400 mb-1.5 px-1 font-medium">
                  Uji simulasi pesan:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => send("Beli telur 1kg 28.000", "pengeluaran", "Pangan & Sembako")} className="text-[11px] bg-[#242F3D] hover:bg-[#2b394a] text-gray-200 px-2.5 py-1.5 rounded-lg border border-gray-700">
                    Beli telur 28.000
                  </button>
                  <button onClick={() => send("Bonus harian 250.000", "pemasukan", "Pemasukan Lain")} className="text-[11px] bg-[#242F3D] hover:bg-[#2b394a] text-gray-200 px-2.5 py-1.5 rounded-lg border border-gray-700">
                    Bonus 250.000
                  </button>
                </div>
              </div>
            </div>
            <button onClick={onOpenGuide} className="block mx-auto mt-3 text-xs font-semibold text-sakuGreen underline underline-offset-4">
        Lihat panduan format pesan
      </button>
      <p className="text-center text-xs text-sakuText-light mt-3 max-w-md mx-auto">
              * Contoh simulasi pencatatan. Interaksi bot yang sebenarnya
              dilakukan setelah akun terhubung.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
