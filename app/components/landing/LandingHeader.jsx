'use client';

import Logo from '@/app/components/ui/Logo';
import { CloseIcon } from '@/app/components/ui/Icons';
import { Container } from './primitives';

const navLinks = [
  ["#cara-kerja", "Cara Kerja"],
  ["#fitur", "Fitur"],
  ["#panduan", "Panduan"],
  ["#tentang-kami", "Tentang Kami"],
];

export default function LandingHeader({ menu, setMenu, openAuth }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-sakuIvory/90 border-b border-sakuGreen-light/60">
      <Container>
        <div className="h-16 sm:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group rounded-lg p-1">
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Logo />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center text-lg sm:text-xl font-bold tracking-widest leading-none">
                <span className="text-sakuPink">SAKU</span>
                <span className="text-sakuGreen">PUAN</span>
              </div>
              <span className="text-[11px] text-sakuText-muted font-medium mt-1">
                Keuangan Rumah Tangga
              </span>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map(([h, l]) => (<a key={h} href={h} className="hover:text-sakuGreen transition-colors py-1">
                {l}
              </a>))}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => openAuth("login")} className="text-sm font-semibold text-sakuGreen hover:text-sakuGreen-hover px-3 py-2">
              Login
            </button>
            <button onClick={() => openAuth("register")} className="bg-sakuGreen hover:bg-sakuGreen-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all active:scale-[0.98]">
              Daftar
            </button>
          </div>
          <button onClick={() => setMenu(!menu)} aria-label="Buka Menu Navigasi" className="md:hidden p-2 hover:text-sakuGreen">
            {menu ? (<CloseIcon />) : (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>)}
          </button>
        </div>
      </Container>
      {menu && (<div className="md:hidden fade-up border-b border-sakuGreen-light bg-sakuIvory px-4 pt-3 pb-6 space-y-1">
          {navLinks.map(([h, l]) => (<a key={h} href={h} onClick={() => setMenu(false)} className="block px-3 py-2.5 rounded-md text-base font-medium hover:bg-sakuGreen-light">
              {l}
            </a>))}
          <div className="pt-4 mt-2 border-t border-sakuGreen-light/60 flex flex-col gap-2">
            <button onClick={() => openAuth("login")} className="w-full py-2.5 font-medium text-sakuGreen border border-sakuGreen/30 rounded-lg">
              Login
            </button>
            <button onClick={() => openAuth("register")} className="w-full py-2.5 font-semibold text-white bg-sakuGreen rounded-lg shadow-sm">
              Mulai Kelola Keuangan
            </button>
          </div>
        </div>)}
    </header>
  );
}
