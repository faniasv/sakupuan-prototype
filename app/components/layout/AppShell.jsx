"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import AdvisorToggle from "@/app/components/advisor/AdvisorToggle";
import ProfileModal from "@/app/components/profile/ProfileModal";
import { useApp } from "@/app/components/providers/AppProvider";
import { Icons } from "@/app/components/ui/Icons";
import Logo from "@/app/components/ui/Logo";
import { NAV_ITEMS, NO_NAV_PREFIXES, WIDE_PREFIXES } from "@/lib/constants";

const startsWithAny = (path, prefixes) => prefixes.some((p) => path.startsWith(p));

export default function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, authLoading, updateProfile, city } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isAuthPage = pathname.startsWith("/auth");
  const showAppNav = !startsWithAny(pathname, NO_NAV_PREFIXES);
  const wide = startsWithAny(pathname, WIDE_PREFIXES);

  // Client-side route guard (the API enforces auth too).
  useEffect(() => {
    if (!authLoading && !user && !isAuthPage) router.replace("/auth");
  }, [authLoading, user, isAuthPage, router]);

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const ready = isAuthPage || (!authLoading && user);

  return (
    <div className="min-h-screen bg-[#FBF8F5] text-[#1E2D24] font-sans flex flex-col selection:bg-[#FFF0F6] selection:text-[#FF4B93]">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAF3EC] shadow-sm">
        <div className="relative max-w-[1100px] mx-auto px-4 h-16 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-8">
          <Link href="/" className="flex items-center gap-2 justify-self-start">
            <Logo className="w-7 h-9" />
            <div className="flex flex-col">
              <div className="flex items-center text-base font-extrabold tracking-wider leading-none">
                <span className="text-[#FF4B93]">SAKU</span>
                <span className="text-[#1F5932] ml-1">PUAN</span>
              </div>
              <span className="text-[10px] text-[#485A50] font-medium hidden sm:inline">Keuangan Rumah Tangga</span>
            </div>
          </Link>

          {showAppNav && (
            <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 text-sm font-semibold">
              {NAV_ITEMS.map((n) => {
                const Icon = Icons[n.icon];
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${
                      pathname.startsWith(n.href) ? "bg-[#EAF3EC] text-[#1F5932]" : "text-[#6E8276] hover:text-[#1F5932]"
                    }`}
                  >
                    <Icon className="w-4 h-4 hidden lg:block" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {showAppNav && user && (
            <div className="flex items-center gap-2 ml-auto mr-2 justify-self-end">
              <button aria-label="Notifikasi" className="relative w-10 h-10 rounded-full bg-white shadow-soft text-sakuText flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
                </svg>
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-sakuPink ring-2 ring-white" />
              </button>
              <button
                onClick={() => setProfileOpen(true)}
                aria-label="Profil"
                aria-haspopup="dialog"
                className="w-10 h-10 rounded-full bg-sakuPink-light text-sakuPink hover:ring-2 hover:ring-sakuPink-border flex items-center justify-center text-sm font-extrabold transition-shadow"
              >
                {user.name.trim() ? (
                  user.name.trim()[0].toUpperCase()
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className="md:hidden w-10 h-10 rounded-full bg-white shadow-soft text-sakuText flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round">
                  {menuOpen ? <path d="M6 18 18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          )}
        </div>

        {showAppNav && menuOpen && (
          <>
            <div className="md:hidden fixed inset-0 top-16 z-[-1] bg-sakuText/30" onClick={() => setMenuOpen(false)} aria-hidden="true" />
            <nav id="mobile-menu" aria-label="Menu halaman" className="md:hidden absolute top-full inset-x-0 bg-white border-b border-[#EAF3EC] shadow-floating px-3 py-3 fade-up">
              {NAV_ITEMS.map((n) => {
                const Icon = Icons[n.icon];
                const active = pathname.startsWith(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    aria-current={active ? "page" : undefined}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      active ? "bg-[#EAF3EC] text-[#1F5932]" : "text-[#485A50] hover:bg-[#FBF8F5]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </>
        )}
      </header>

      <main className={`flex-1 w-full mx-auto px-4 py-6 sm:py-8 ${wide ? "md:max-w-none md:px-0" : "max-w-[1000px]"}`}>
        {ready ? children : <p className="text-center text-sm text-sakuText-light py-20">Memuat...</p>}
      </main>

      {profileOpen && user && (
        <ProfileModal
          initial={{ name: user.name, email: user.email, phone: user.phone }}
          onSave={async (v) => {
            await updateProfile(v);
            setProfileOpen(false);
          }}
          onClose={() => setProfileOpen(false)}
        />
      )}
      {showAppNav && user && <AdvisorToggle name={user.name} city={city} />}

      <footer className="hidden md:block bg-[#1E2D24] text-white py-6 mt-auto border-t border-[#485A50]/40">
        <div className="max-w-[1000px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-6" />
            <span className="font-bold text-white">SAKUPUAN Prototype</span>
          </div>
          <p>© 2026 SAKUPUAN. Asesmen Finansial & Pencatatan Kontekstual.</p>
        </div>
      </footer>
    </div>
  );
}
