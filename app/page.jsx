"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

const Check = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const Arrow = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function AuthModal({ open, onClose, mode, onMode, onSubmit }) {
  const [name, setName] = useState("");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sakuText/60 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-sakuGreen-light">
        <button onClick={onClose} aria-label="Tutup" className="absolute top-4 right-4 text-gray-400 hover:text-sakuText p-1">
          <CloseIcon />
        </button>

        <div className="flex border-b border-gray-200 mb-6 pr-6">
          {["register", "login"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onMode(t)}
              className={`flex-1 pb-3 text-sm border-b-2 font-bold transition-colors ${
                mode === t ? "text-sakuGreen border-sakuGreen" : "text-gray-400 border-transparent hover:text-sakuText"
              }`}
            >
              {t === "register" ? "Daftar Akun Baru" : "Login Masuk"}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          {mode === "register" && (
            <label className="block text-left">
              <span className="block text-xs font-semibold mb-1 text-sakuText">Nama Lengkap</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Vivin" className="w-full text-sm px-3.5 py-3 rounded-xl bg-sakuIvory border border-sakuGreen-light focus:outline-none focus:border-sakuGreen" />
            </label>
          )}
          <label className="block text-left">
            <span className="block text-xs font-semibold mb-1 text-sakuText">Alamat Email / No. WhatsApp</span>
            <input placeholder="nama@email.com atau 0812xxx" className="w-full text-sm px-3.5 py-3 rounded-xl bg-sakuIvory border border-sakuGreen-light focus:outline-none focus:border-sakuGreen" />
          </label>
          <label className="block text-left">
            <span className="block text-xs font-semibold mb-1 text-sakuText">Kata Sandi</span>
            <input type="password" placeholder="••••••••" className="w-full text-sm px-3.5 py-3 rounded-xl bg-sakuIvory border border-sakuGreen-light focus:outline-none focus:border-sakuGreen" />
          </label>

          {mode === "register" && (
            <div className="p-3 bg-sakuPink-light rounded-xl text-xs text-sakuPink-dark font-medium border border-sakuPink-border">
              Penghubungan Telegram dilakukan setelah proses pendaftaran awal selesai.
            </div>
          )}

          <button type="submit" className="w-full bg-sakuGreen hover:bg-sakuGreen-hover text-white font-bold py-3.5 rounded-xl shadow-md text-sm transition-transform active:scale-98">
            {mode === "register" ? "Lanjutkan Pendaftaran" : "Masuk ke Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("register");
  const [msgs, setMsgs] = useState([
    { id: 1, from: "user", text: "Gaji 2.000.000", time: "09:15" },
    { id: 2, from: "bot", text: "Catatan pemasukan berhasil ditambahkan.", type: "pemasukan", cat: "Pemasukan Utama", time: "09:15" },
    { id: 3, from: "user", text: "Belanja sayur 35.000", time: "10:42" },
    { id: 4, from: "bot", text: "Catatan pengeluaran berhasil ditambahkan.", type: "pengeluaran", cat: "Belanja Pangan", time: "10:42" },
  ]);

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleAuthSubmit = () => {
    setAuthOpen(false);
    
    if (authMode === "register") {
      router.push("/assesment");
    } else {
      router.push("/dashboard");
    }
  };

  const sendSimulated = (text, type, cat) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMsgs((m) => [...m, { id: Date.now(), from: "user", text, time }]);
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: Date.now() + 1, from: "bot", text: `Catatan ${type} berhasil ditambahkan.`, type, cat, time },
      ]);
    }, 500);
  };

  return (
    <div className="bg-sakuIvory text-sakuText antialiased">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-sakuIvory/90 border-b border-sakuGreen-light/60">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-8 h-10">
              <Image src="/sakupuan-logo.svg" alt="Saku Puan Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-lg sm:text-xl font-bold tracking-widest leading-none">
                <span className="text-sakuPink">SAKU</span>
                <span className="text-sakuGreen ml-1">PUAN</span>
              </div>
              <span className="text-[11px] text-sakuText-muted font-medium mt-1">Keuangan Rumah Tangga</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#cara-kerja" className="hover:text-sakuGreen transition-colors">Cara Kerja</a>
            <a href="#fitur" className="hover:text-sakuGreen transition-colors">Fitur</a>
            <a href="#panduan" className="hover:text-sakuGreen transition-colors">Panduan</a>
            <a href="#tentang-kami" className="hover:text-sakuGreen transition-colors">Tentang Kami</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => handleOpenAuth("login")} className="text-sm font-semibold text-sakuGreen hover:text-sakuGreen-hover px-3 py-2">
              Login
            </button>
            <button onClick={() => handleOpenAuth("register")} className="bg-sakuGreen hover:bg-sakuGreen-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all">
              Daftar
            </button>
          </div>
        </div>
      </header>

      <section className="py-10 sm:py-16 overflow-hidden">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3.5 py-1.5 rounded-full bg-sakuPink-light text-sakuPink-dark text-xs font-semibold">
                ● Pengelolaan keuangan personal yang lebih kontekstual
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-sakuText">
                Dapur Tenang,<br />Dompet Senang.
              </h1>
              <p className="text-base sm:text-lg text-sakuText-muted leading-relaxed">
                SAKUPUAN membantu kamu mencatat pemasukan dan pengeluaran, memantau belanja kebutuhan pangan, serta memahami bagaimana perubahan harga pangan berkaitan dengan pengeluaran rumah tangga.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button onClick={() => handleOpenAuth("register")} className="inline-flex items-center gap-2 bg-sakuGreen hover:bg-sakuGreen-hover text-white font-semibold px-7 py-3.5 rounded-lg shadow-md">
                  Mulai Kelola Keuangan <Arrow />
                </button>
                <a href="#cara-kerja" className="inline-flex items-center gap-1 text-sakuGreen font-semibold px-4 py-3 hover:underline">
                  Pelajari Cara Kerjanya <span className="text-sakuPink">↓</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white rounded-2xl border border-sakuGreen-light shadow-soft p-5 sm:p-6 space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sakuPink text-white flex items-center justify-center font-bold">R</div>
                    <div>
                      <p className="text-xs text-sakuText-light">Ringkasan Dapur Ibu</p>
                      <p className="text-sm font-semibold">Periode Juni 2026</p>
                    </div>
                  </div>
                  <span className="text-xs bg-sakuPink-light text-sakuPink-dark font-semibold px-2.5 py-1 rounded-md">Data Simulasi</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-sakuIvory border border-sakuGreen-light">
                    <p className="text-xs text-sakuText-muted font-medium">Total Pengeluaran</p>
                    <p className="text-lg font-bold text-sakuGreen mt-0.5">Rp 5.250.000</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-sakuPink-light/50 border border-sakuPink-border">
                    <p className="text-xs text-sakuText-muted font-medium">Belanja Pangan</p>
                    <p className="text-lg font-bold text-sakuPink mt-0.5">Rp 2.350.000</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-sakuPink-light/70 border border-sakuPink-border text-xs text-sakuPink-dark">
                  <strong>Konteks Pangan:</strong> Belanja pangan naik 8% pada bulan Juni bertepatan dengan lonjakan harga beras & cabai merah nasional.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} mode={authMode} onMode={setAuthMode} onSubmit={handleAuthSubmit} />
    </div>
  );
}