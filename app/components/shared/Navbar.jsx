"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../ui/Logo";
import { Icons } from "../ui/Icons";

export default function Navbar() {
  const pathname = usePathname();
  const [menuState, setMenuState] = useState({ pathname: null, open: false });
  const menuOpen = menuState.pathname === pathname && menuState.open;
  const setMenuOpen = (open) => setMenuState({ pathname, open });

  // Sembunyikan Navbar jika sedang di halaman Landing, Login, atau Asesmen awal
  const hideNavRoutes = ["/landing-page", "/login", "/assessment"];
  if (!pathname || hideNavRoutes.some(route => pathname.startsWith(route))) return null;

  const NAV_ITEMS = [
    { href: "/", label: "Home", icon: Icons.Home },
    { href: "/insight", label: "Insight", icon: Icons.Chart },
    { href: "/prediksi", label: "Prediksi", icon: Icons.Trend },
    { href: "/rekomendasi", label: "Rekomendasi", icon: Icons.Bulb },
    { href: "/action-plan", label: "Action Plan", icon: Icons.List },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sakuGreen-light shadow-sm">
      <div className="relative max-w-275 mx-auto px-4 h-16 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-8">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer justify-self-start">
          <Logo className="w-7 h-9" />
          <div className="flex flex-col">
            <div className="flex items-center text-base font-extrabold tracking-wider leading-none">
              <span className="text-sakuPink">SAKU</span>
              <span className="text-sakuGreen ml-1">PUAN</span>
            </div>
            <span className="text-[10px] text-sakuText font-medium hidden sm:inline">
              Keuangan Rumah Tangga
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 text-sm font-semibold">
          {NAV_ITEMS.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-1.5 px-2.5 lg:px-3 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  active ? "bg-sakuGreen-light text-sakuGreen" : "text-sakuText hover:text-sakuGreen"
                }`}
              >
                <n.icon className="w-4 h-4 hidden lg:block" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Menu (Profile & Notification) */}
        <div className="flex items-center gap-2 ml-auto mr-2 justify-self-end">
          <button aria-label="Notifikasi" className="relative w-10 h-10 rounded-full bg-white shadow-soft text-sakuText flex items-center justify-center">
            <Icons.Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-sakuPink ring-2 ring-white" />
          </button>
          <button aria-label="Profil" className="w-10 h-10 rounded-full bg-sakuPink-light text-sakuPink hover:ring-2 hover:ring-sakuPink-border flex items-center justify-center text-sm font-extrabold transition-shadow">
            V
          </button>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-white shadow-soft text-sakuText flex items-center justify-center"
          >
            {menuOpen ? <Icons.Close className="w-5 h-5" /> : <Icons.Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <nav className="md:hidden absolute top-full inset-x-0 bg-white border-b border-sakuGreen-light shadow-floating px-3 py-3 fade-up">
          {NAV_ITEMS.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  active ? "bg-sakuGreen-light text-sakuGreen" : "text-sakuText hover:text-sakuGreen"
                }`}
              >
                <n.icon className="w-5 h-5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}