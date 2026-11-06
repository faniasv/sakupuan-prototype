"use client";
import { useState, useRef, useEffect } from "react";
import { Icons } from "./ui/Icons";

const advisorReply = (q, city) => {
  const t = q.toLowerCase();
  if (/(cabai|cabe|sayur|harga|beras|telur)/.test(t))
    return `Harga cabai di ${city} lagi naik sekitar 8% minggu ini, beras dan telur masih stabil. Coba ganti sebagian cabai segar dengan cabai kering atau sambal matang biar belanja dapur tetap aman.`;
  if (/(nabung|tabung|darurat)/.test(t))
    return "Mulai dari yang kecil dulu, Puan. Sisihkan 10% tiap gajian di awal, bukan dari sisa. Target dana darurat idealnya 3 sampai 6 bulan pengeluaran rutin.";
  if (/(utang|cicil|paylater|pinjol)/.test(t))
    return "Usahakan total cicilan maksimal 30% dari pemasukan bulanan. Kalau ada beberapa cicilan, lunasi yang bunganya paling besar dulu, ya.";
  if (/(budget|anggaran|bagi|gaji)/.test(t))
    return "Pola sederhana yang bisa dicoba: 50% kebutuhan pokok, 30% keinginan, 20% tabungan. Pos dapur masuk ke kebutuhan pokok, jadi catat rutin biar kelihatan kalau mulai lewat batas.";
  return "Mimin siap bantu soal belanja dapur, tabungan, cicilan, atau atur anggaran. Coba ceritain lebih detail ya, Puan.";
};

export default function AIAdvisor({ name = "Puan", city = "Surabaya", onClose }) {
  const [msgs, setMsgs] = useState([
    {
      id: 1,
      from: "bot",
      text: `Halo ${name}! Mimin di sini. Mau ngobrolin apa hari ini? Bisa soal belanja dapur, tabungan, atau cicilan.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, typing]);

  const ask = (text) => {
    const q = text.trim();
    if (!q || typing) return;
    setMsgs((m) => [...m, { id: Date.now(), from: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: Date.now() + 1, from: "bot", text: advisorReply(q, city) },
      ]);
      setTyping(false);
    }, 700);
  };

  const quick = [
    "Harga cabai lagi naik?",
    "Gimana mulai nabung?",
    "Cicilan aman berapa?",
    "Cara bagi gaji",
  ];

  return (
    <div className="bg-white rounded-3xl border border-sakuGreen-light shadow-2xl flex flex-col w-[calc(100vw-2rem)] sm:w-96 h-[min(560px,calc(100vh-10rem))] overflow-hidden fade-up">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-sakuGreen-light">
        <div className="w-10 h-10 rounded-full bg-sakuGreen text-white flex items-center justify-center">
          <Icons.Bot className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-sakuText">AI Advisor</p>
          <p className="text-[11px] text-sakuGreen flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sakuGreen" />
            online
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Tutup chat"
          className="ml-auto p-1.5 rounded-lg text-sakuText-light hover:bg-sakuGreen-light hover:text-sakuText"
        >
          <Icons.Close className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-sakuIvory">
        {msgs.map((m) => (
          <div
            key={m.id}
            className={`flex fade-up ${
              m.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <p
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.from === "user" ? "chat-bubble-user" : "chat-bubble-bot"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <span className="chat-bubble-bot px-4 py-3 rounded-2xl flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-sakuText-light animate-bounce"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-sakuGreen-light p-3 space-y-2 bg-white">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-sakuGreen-border text-sakuGreen hover:bg-sakuGreen-light"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya Mimin soal keuangan dapur..."
            className="flex-1 text-base sm:text-sm px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-sakuGreen focus:ring-1 focus:ring-sakuGreen"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            aria-label="Kirim"
            className="w-11 h-11 rounded-xl bg-sakuPink hover:bg-sakuPink-hover disabled:opacity-40 text-white flex items-center justify-center shrink-0"
          >
            <Icons.Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export function AdvisorToggle({ name = "Puan", city = "Surabaya" }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <AIAdvisor name={name} city={city} onClose={() => setOpen(false)} />
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Tutup Puan AI" : "Buka Puan AI"}
        className="flex items-center gap-2 bg-sakuGreen hover:bg-sakuGreen-hover text-white font-semibold text-sm pl-3.5 pr-4 py-3 rounded-full shadow-floating transition-transform active:scale-95"
      >
        <Icons.Bot className="w-5 h-5" />
        {open ? "Tutup" : "AI Advisor"}
      </button>
    </div>
  );
}