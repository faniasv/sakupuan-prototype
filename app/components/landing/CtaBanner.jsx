'use client';

import { Container } from './primitives';

export default function CtaBanner({ openAuth }) {
  return (
    <section className="pb-14 sm:pb-16 lg:pb-20">
      <Container>
        <div className="relative rounded-3xl bg-sakuGreen text-white px-6 py-10 sm:p-12 lg:p-16 overflow-hidden shadow-floating text-center">
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" fill="none">
            <circle cx="400" cy="200" r="300" stroke="white" strokeWidth="40"/>
            <circle cx="400" cy="200" r="200" stroke="#FF4B93" strokeWidth="20"/>
          </svg>
          <div className="relative max-w-2xl mx-auto space-y-6">
            <h2 className="text-[28px] sm:text-4xl font-bold tracking-tight text-balance">
              Mulai Kenali Pola Pengeluaranmu.
            </h2>
            <p className="text-base sm:text-lg text-emerald-100 leading-relaxed">
              Bangun kebiasaan mencatat keuangan dan pahami perubahan
              pengeluaran belanja dengan lebih baik bersama Saku Puan.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button onClick={() => openAuth("register")} className="w-full sm:w-auto bg-sakuPink hover:bg-sakuPink-hover font-bold px-8 py-3.5 rounded-lg shadow-md transition-all active:scale-[0.98]">
                Daftar Sekarang
              </button>
              <button onClick={() => openAuth("login")} className="w-full sm:w-auto hover:text-emerald-100 underline underline-offset-4 text-sm font-semibold px-4 py-3">
                Sudah punya akun? Login
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
