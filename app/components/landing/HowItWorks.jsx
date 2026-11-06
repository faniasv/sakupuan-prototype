'use client';

import { Container, SectionHead } from './primitives';

export default function HowItWorks({  }) {
  return (
    <section id="cara-kerja" className="scroll-mt-20 py-14 sm:py-16 lg:py-24">
      <Container>
        <SectionHead eyebrow="Alur Penggunaan" title="Mulai dari Catatan, Sampai Menjadi Insight." desc="Empat langkah sederhana untuk pencatatan keuangan yang lebih bijak dan berkonteks."/>
        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
        [
            "Catat Transaksi",
            "Masukkan pemasukan dan pengeluaran melalui alur pencatatan Saku Puan.",
            "Sangat praktis",
        ],
        [
            "Pantau Pengeluaran",
            "Lihat ringkasan dan perubahan pengeluaran belanja dari waktu ke waktu.",
            "Visualisasi otomatis",
        ],
        [
            "Bandingkan Tren Harga Pangan",
            "Saku Puan membandingkan data pengeluaran yang relevan dengan data harga pangan berdasarkan wilayah dan periode.",
            "Konteks Wilayah",
        ],
        [
            "Pahami Insight",
            "Gunakan insight sebagai bahan pertimbangan untuk merencanakan anggaran belanja.",
            "Keputusan Berbasis Data",
        ],
    ].map(([t, d, f], i) => {
        const last = false;
        return (<div key={t} className={`bg-white p-6 rounded-2xl border shadow-card flex flex-col justify-between ${last ? "border-sakuPink-border" : "border-sakuGreen-light"}`}>
                <div>
                  <div className={`w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center mb-4 ${last ? "bg-sakuPink" : "bg-sakuGreen"}`}>
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-base mb-2">{t}</h3>
                  <p className="text-sm sm:text-xs text-sakuText-muted leading-relaxed">
                    {d}
                  </p>
                </div>
                <div className={`mt-6 pt-3 border-t border-gray-100 text-[11px] font-medium flex items-center gap-1 ${last ? "text-sakuPink" : "text-sakuGreen"}`}>
                  {f}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={last ? "M5 13l4 4L19 7" : "M9 5l7 7-7 7"}/>
                  </svg>
                </div>
              </div>);
    })}
        </div>
      </Container>
    </section>
  );
}
