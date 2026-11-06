'use client';

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { Icons } from '@/app/components/ui/Icons';

export default function AIAdvisor({ name, city, onClose, }) {
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
    const ask = async (text) => {
        const q = text.trim();
        if (!q || typing)
            return;
        setMsgs((m) => [...m, { id: Date.now(), from: "user", text: q }]);
        setInput("");
        setTyping(true);
        let reply;
        try {
            ({ reply } = await api.post("/api/advisor/chat", { message: q, city }));
        }
        catch (err) {
            reply = err.status === 429
                ? "Pelan-pelan ya Puan, Mimin lagi kewalahan. Coba lagi sebentar."
                : "Maaf Puan, Mimin lagi gangguan. Coba lagi ya.";
        }
        setMsgs((m) => [...m, { id: Date.now() + 1, from: "bot", text: reply }]);
        setTyping(false);
    };
    const quick = [
        "Harga cabai lagi naik?",
        "Gimana mulai nabung?",
        "Cicilan aman berapa?",
        "Cara bagi gaji",
    ];
    return (<div className="bg-white rounded-3xl border border-[#EAF3EC] shadow-2xl flex flex-col w-[calc(100vw-2rem)] sm:w-96 h-[min(560px,calc(100vh-10rem))] overflow-hidden fade-up">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#EAF3EC]">
        <div className="w-10 h-10 rounded-full bg-[#1F5932] text-white flex items-center justify-center">
          <Icons.Bot className="w-5 h-5"/>
        </div>
        <div>
          <p className="text-sm font-bold text-[#1E2D24]">AI Advisor</p>
          <p className="text-[11px] text-[#1F5932] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1F5932]"/>
            online
          </p>
        </div>
        <button onClick={onClose} aria-label="Tutup chat" className="ml-auto p-1.5 rounded-lg text-[#6E8276] hover:bg-[#EAF3EC] hover:text-[#1E2D24]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round">
            <path d="M6 18 18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#FBF8F5]">
        {msgs.map((m) => (<div key={m.id} className={`flex fade-up ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <p className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.from === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`}>
              {m.text}
            </p>
          </div>))}
        {typing && (<div className="flex justify-start">
            <span className="chat-bubble-bot px-4 py-3 rounded-2xl flex gap-1">
              {[0, 1, 2].map((i) => (<span key={i} className="w-1.5 h-1.5 rounded-full bg-[#6E8276] animate-bounce" style={{ animationDelay: `${i * 120}ms` }}/>))}
            </span>
          </div>)}
        <div ref={endRef}/>
      </div>
      <div className="border-t border-[#EAF3EC] p-3 space-y-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {quick.map((q) => (<button key={q} onClick={() => ask(q)} className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-[#B8D8C0] text-[#1F5932] hover:bg-[#EAF3EC]">
              {q}
            </button>))}
        </div>
        <form onSubmit={(e) => {
            e.preventDefault();
            ask(input);
        }} className="flex gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tanya Mimin soal keuangan dapur..." className="flex-1 text-base sm:text-sm px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:border-[#1F5932] focus:ring-1 focus:ring-[#1F5932]"/>
          <button type="submit" disabled={!input.trim() || typing} aria-label="Kirim" className="w-11 h-11 rounded-xl bg-[#FF4B93] hover:bg-[#E0367B] disabled:opacity-40 text-white flex items-center justify-center">
            <Icons.Send className="w-4 h-4"/>
          </button>
        </form>
      </div>
    </div>);
}
