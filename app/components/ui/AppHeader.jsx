"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Icons } from "./Icons";

export default function AppHeader() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { href: "/dashboard", label: "Home", icon: Icons.Home },
    { href: "/insight", label: "Insight", icon: Icons.Chart },
    { href: "/forecast", label: "Prediksi", icon: Icons.Trend },
    { href: "/rekomendasi", label: "Rekomendasi", icon: Icons.Bulb },
    { href: "/action-plan", label: "Action Plan", icon: Icons.List },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sakuGreen-light shadow-xs">
      <div className="max-w-275 mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="relative w-6 h-8">
            <Image src="/sakupuan-logo.svg" alt="Saku Puan Logo" fill className="object-contain" priority />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center text-base font-extrabold tracking-wider leading-none">
              <span className="text-sakuPink">SAKU</span>
              <span className="text-sakuGreen ml-1">PUAN</span>
            </div>
          </div>
        </Link>

        {/* Tab Navigasi Aplikasi */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
          {NAV_ITEMS.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${
                  active ? "bg-sakuGreen-light text-sakuGreen font-bold" : "text-sakuText-muted hover:text-sakuGreen"
                }`}
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Notifikasi & Profil */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-white border border-sakuGreen-light text-sakuText flex items-center justify-center shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
          </button>
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-sakuPink-light text-sakuPink flex items-center justify-center font-extrabold text-sm border border-sakuPink-border"
          >
            P
          </Link>
        </div>
      </div>
    </header>
  );
}