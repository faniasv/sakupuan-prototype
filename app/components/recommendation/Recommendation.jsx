"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/app/components/providers/AppProvider";
import Svg from "@/app/components/ui/Svg";
import { api } from "@/lib/api";

const BOT = ["M12 4v4", "M7 8h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3z", "M9 13h.01", "M15 13h.01", "M9.5 17h5"];
const BULB = ["M9 18h6", "M10 22h4", "M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"];
const SEND = ["M22 2 11 13", "M22 2l-7 20-4-9-9-4z"];
const CHECK = ["M5 12.5l4.5 4.5L19 7"];
const QUICK = ["Cara mulai nabung?", "Cicilan aman berapa?", "Tips masak hemat", "Cara bagi gaji"];

/** Full-page chat with the AI Advisor. Open /recommendation/chat?q=... to pre-ask a question. */
export default function Recommendation() {
  const router = useRouter();
  const initialQuestion = useSearchParams().get("q") ?? undefined;
  const { city, tasks, addTask } = useApp();
  const [items, setItems] = useState([
    { id: 1, kind: "text", from: "user", text: "Gimana cara hemat belanja dapur bulan ini pas cabai lagi naik?" },
    { id: 2, kind: "text", from: "bot", text: `Halo Puan! Harga cabai di ${city} memang lagi naik 8% minggu ini. Mimin sarankan akali dengan olahan sambal matang atau cabai kering ya!` },
    { id: 3, kind: "suggestion", s: { title: "Beli Cabai Kering / Sambal Olahan", desc: "Menghemat hingga 25% anggaran bumbu dapur harian.", cat: "Makanan & minuman" } },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [items, typing]);

  const ask = async (text) => {
    const q = text.trim();
    if (!q || typing) return;
    setItems((m) => [...m, { id: Date.now(), kind: "text", from: "user", text: q }]);
    setInput("");
    setTyping(true);
    try {
      const r = await api.post("/api/advisor/chat", { message: q, city });
      setItems((m) => [
        ...m,
        { id: Date.now() + 1, kind: "text", from: "bot", text: r.reply },
        ...(r.suggestion ? [{ id: Date.now() + 2, kind: "suggestion", s: r.suggestion }] : []),
      ]);
    } catch (e) {
      setItems((m) => [...m, { id: Date.now() + 1, kind: "text", from: "bot", text: "Maaf Puan, Mimin lagi gangguan. Coba lagi ya." }]);
    } finally {
      setTyping(false);
    }
  };

  // A question from the URL is asked once on arrival.
  const askedInitial = useRef(false);
  useEffect(() => {
    if (initialQuestion && !askedInitial.current) {
      askedInitial.current = true;
      ask(initialQuestion);
    }
  }, [initialQuestion]); // eslint-disable-line react-hooks/exhaustive-deps

  const inPlan = (title) => tasks.some((t) => t.title === title);

  return (
    <div className="max-w-xl mx-auto -mt-2 sm:mt-0 h-[calc(100dvh-7rem)] md:h-[min(760px,calc(100dvh-9rem))] flex flex-col bg-white rounded-3xl border border-sakuGreen-light shadow-card overflow-hidden fade-up">
      <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-sakuGreen-light">
        <button onClick={() => router.push("/recommendation")} aria-label="Kembali ke rekomendasi" className="p-1.5 -ml-1.5 rounded-lg text-sakuText-muted hover:bg-sakuGreen-light hover:text-sakuText shrink-0">
          <Svg d={["M15 18l-6-6 6-6"]} className="w-5 h-5" />
        </button>
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sakuGreen to-sakuGreen-dark text-white flex items-center justify-center">
            <Svg d={BOT} className="w-5 h-5" />
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#2BC46B] ring-2 ring-white" />
        </div>
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-sakuText leading-tight flex items-center gap-2">
            AI Advisor
            <span className="text-[11px] font-semibold text-[#1E9E55] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2BC46B]" />
              Online
            </span>
          </p>
          <p className="text-xs text-sakuText-light truncate">Konsultasi Keuangan Dapur</p>
        </div>
        <button onClick={() => router.push("/action-plan")} className="ml-auto shrink-0 text-xs font-semibold text-sakuGreen bg-sakuGreen-light hover:bg-sakuGreen-border/60 px-3 py-2 rounded-full transition-colors">
          Action Plan · {tasks.filter((t) => !t.done).length}
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-3 bg-sakuIvory">
        <p className="text-center">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-sakuText-light bg-white px-2.5 py-1 rounded-full">Hari ini</span>
        </p>
        {items.map((m) => {
          if (m.kind === "text")
            return (
              <div key={m.id} className={`flex fade-up ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <p className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}>{m.text}</p>
              </div>
            );
          const added = inPlan(m.s.title);
          return (
            <div key={m.id} className="max-w-[88%] fade-up bg-sakuPink-light border border-sakuPink-border rounded-2xl p-4 space-y-3">
              <div className="flex gap-3">
                <span className="w-9 h-9 rounded-xl bg-white text-sakuPink flex items-center justify-center shrink-0">
                  <Svg d={BULB} className="w-[18px] h-[18px]" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-sakuText leading-snug">{m.s.title}</p>
                  <p className="text-xs text-sakuText-muted mt-0.5 leading-relaxed">{m.s.desc}</p>
                </div>
              </div>
              {added ? (
                <div className="flex items-center justify-between gap-2 bg-white rounded-xl px-3 py-2.5">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-sakuGreen">
                    <Svg d={CHECK} className="w-4 h-4" />
                    Tersimpan di Action Plan
                  </span>
                  <button onClick={() => router.push("/action-plan")} className="text-xs font-bold text-sakuPink hover:underline">
                    Lihat
                  </button>
                </div>
              ) : (
                <button onClick={() => addTask({ title: m.s.title, cat: m.s.cat, note: m.s.desc })} className="w-full bg-sakuPink hover:bg-sakuPink-hover text-white text-sm font-bold py-2.5 rounded-xl transition-colors active:scale-[0.98]">
                  + Masukkan ke Action Plan
                </button>
              )}
            </div>
          );
        })}
        {typing && (
          <div className="flex justify-start">
            <span className="chat-bubble-bot px-4 py-3 rounded-2xl flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-sakuText-light animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-sakuGreen-light p-3 space-y-2 bg-white">
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {QUICK.map((q) => (
            <button key={q} onClick={() => ask(q)} className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-sakuGreen-border text-sakuGreen hover:bg-sakuGreen-light">
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
            placeholder="Ketik pertanyaan ke AI Advisor..."
            aria-label="Pertanyaan untuk AI Advisor"
            className="flex-1 min-w-0 text-base sm:text-sm px-4 py-2.5 rounded-xl bg-sakuIvory border border-sakuGreen-light focus:outline-none focus:border-sakuGreen focus:ring-1 focus:ring-sakuGreen"
          />
          <button type="submit" disabled={!input.trim() || typing} aria-label="Kirim" className="w-11 h-11 rounded-xl bg-sakuGreen hover:bg-sakuGreen-hover disabled:opacity-40 text-white flex items-center justify-center shrink-0">
            <Svg d={SEND} className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
