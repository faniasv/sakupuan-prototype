"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
import Logo from "./components/ui/Logo";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

const Check = ({ className = "" }) => (
  <svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
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

const Container = ({ children }) => (
  <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
);

const SectionHead = ({ eyebrow, title, desc, pink }) => (
  <div className="text-center max-w-2xl mx-auto space-y-3">
    <span className={`text-xs font-bold uppercase tracking-wider ${pink ? "text-sakuPink" : "text-sakuGreen"}`}>
      {eyebrow}
    </span>
    <h2 className="text-2xl sm:text-3xl font-bold text-sakuText text-balance">{title}</h2>
    <p className="text-base text-sakuText-muted leading-relaxed">{desc}</p>
  </div>
);

function Modal({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sakuText/60 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="fade-up bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-sakuGreen-light max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} aria-label="Tutup" className="absolute top-4 right-4 text-gray-400 hover:text-sakuText p-1">
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
}

export function AuthForm({ mode, onMode, onSubmit }) {
  const [name, setName] = useState("");
  const input = "w-full text-base sm:text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-sakuGreen focus:ring-1 focus:ring-sakuGreen";
  
  return (
    <>
      <div className="flex border-b border-gray-200 mb-6 pr-6">
        {["register", "login"].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onMode(t)}
            className={`flex-1 pb-3 text-sm border-b-2 ${mode === t ? "font-bold text-sakuGreen border-sakuGreen" : "font-medium text-gray-400 border-transparent hover:text-sakuText"}`}
          >
            {t === "register" ? "Daftar Akun Baru" : "Login Masuk"}
          </button>
        ))}
      </div>
      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSubmit(mode, name.trim()); }}>
        {mode === "register" && (
          <label className="block">
            <span className="block text-xs font-semibold mb-1">Nama Lengkap</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Puan" className={input} />
          </label>
        )}
        <label className="block">
          <span className="block text-xs font-semibold mb-1">Alamat Email / No. WhatsApp</span>
          <input placeholder="nama@email.com atau 0812xxx" className={input} />
        </label>
        <label className="block">
          <span className="block text-xs font-semibold mb-1">Kata Sandi</span>
          <input type="password" placeholder="••••••••" className={input} />
        </label>
        <button type="submit" className="w-full bg-sakuGreen hover:bg-sakuGreen-hover text-white font-semibold py-3 rounded-lg shadow-sm text-sm">
          {mode === "register" ? "Lanjutkan Pendaftaran" : "Masuk"}
        </button>
      </form>
    </>
  );
}

export default function LandingPage() {
  const [menu, setMenu] = useState(false);
  const [auth, setAuth] = useState(null);

  return (
    <div className="bg-sakuIvory text-sakuText antialiased selection:bg-sakuPink-light selection:text-sakuPink-dark -mx-4 -my-6 sm:-my-8">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-sakuIvory/90 border-b border-sakuGreen-light/60">
        <Container>
          <div className="h-16 sm:h-20 flex items-center justify-between">
            <Link href="#" className="flex items-center gap-2.5 group rounded-lg p-1">
              <Logo className="w-8 h-10" />
              <div className="flex flex-col">
                <div className="flex items-center text-lg sm:text-xl font-bold tracking-widest leading-none">
                  <span className="text-sakuPink">SAKU</span>
                  <span className="text-sakuGreen ml-1">PUAN</span>
                </div>
                <span className="text-[11px] text-sakuText-muted font-medium mt-1">
                  Keuangan Rumah Tangga
                </span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => setAuth("login")} className="text-sm font-semibold text-sakuGreen hover:text-sakuGreen-hover px-3 py-2">
                Login
              </button>
              <Link href="/" className="bg-sakuGreen hover:bg-sakuGreen-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all">
                Masuk Dashboard
              </Link>
            </div>
          </div>
        </Container>
      </header>

      <main>
        <section className="py-12 lg:py-20">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sakuPink-light border border-sakuPink-border text-sakuPink-dark text-xs sm:text-sm font-semibold">
                  <span className="w-2 h-2 shrink-0 rounded-full bg-sakuPink animate-pulse" />
                  Pengelolaan keuangan personal yang lebih kontekstual
                </div>
                <h1 className="text-[32px] sm:text-4xl lg:text-[44px] font-bold leading-[1.18] tracking-tight">
                  Dapur Tenang, Dompet Senang.
                </h1>
                <p className="text-base sm:text-lg text-sakuText-muted leading-relaxed">
                  SAKUPUAN membantu kamu mencatat pemasukan dan pengeluaran, memantau belanja kebutuhan pangan, serta memahami perubahan harga pangan.
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <Link href="/" className="inline-flex items-center gap-2 bg-sakuGreen hover:bg-sakuGreen-hover text-white font-semibold px-7 py-3.5 rounded-lg shadow-md">
                    Mulai Kelola Keuangan <Arrow />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="bg-white rounded-2xl border border-sakuGreen-light shadow-floating p-6 space-y-4">
                  <p className="text-sm font-semibold text-sakuText">Tren Belanja Pangan vs Harga Komoditas</p>
                  <div className="h-32 relative">
                    <Line
                      data={{
                        labels: ["April", "Mei", "Juni"],
                        datasets: [
                          {
                            label: "Belanja Pangan",
                            data: [2100000, 2200000, 2350000],
                            borderColor: "#1F5932",
                            backgroundColor: "rgba(31,89,50,0.1)",
                            fill: true,
                          },
                        ],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Modal open={auth !== null} onClose={() => setAuth(null)}>
        {auth && <AuthForm mode={auth} onMode={setAuth} onSubmit={() => setAuth(null)} />}
      </Modal>
    </div>
  );
}