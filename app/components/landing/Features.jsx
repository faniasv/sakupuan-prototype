'use client';

import { Container, SectionHead } from './primitives';

export default function Features({  }) {
  return (
    <section id="fitur" className="scroll-mt-20 py-14 sm:py-16 bg-white border-y border-sakuGreen-light/60">
      <Container>
        <SectionHead pink eyebrow="Nilai Utama Saku Puan" title="Catat Pengeluaran, Pahami Perubahannya." desc="Pengeluaran belanja bisa berubah dari waktu ke waktu. Saku Puan membantu kamu melihat catatan keuangan dan memahami konteks perubahan harga pangan."/>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 mt-10 sm:mt-12">
          {[
        {
            t: "Pencatatan Lebih Praktis",
            d: "Catat pemasukan dan pengeluaran tanpa harus menyusun semuanya secara manual di spreadsheet.",
            p: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
        },
        {
            t: "Pantau Belanja Kebutuhan Pangan",
            d: "Lihat ringkasan pengeluaran belanja dan perubahannya dari waktu ke waktu.",
            p: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
            pink: true,
        },
        {
            t: "Insight Berbasis Data",
            d: "Bandingkan pola pengeluaran belanja dengan tren harga pangan untuk membantu memahami perubahan anggaran.",
            p: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z",
        },
    ].map((b) => (<div key={b.t} className={`p-6 rounded-2xl bg-sakuIvory border border-sakuGreen-light transition-all group ${b.pink ? "hover:border-sakuPink" : "hover:border-sakuGreen"}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors group-hover:text-white ${b.pink
            ? "bg-sakuPink-light text-sakuPink group-hover:bg-sakuPink"
            : "bg-sakuGreen-light text-sakuGreen group-hover:bg-sakuGreen"}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={b.p}/>
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">{b.t}</h3>
              <p className="text-sm text-sakuText-muted leading-relaxed">
                {b.d}
              </p>
            </div>))}
        </div>
      </Container>
    </section>
  );
}
