'use client';

import Logo from '@/app/components/ui/Logo';
import { Container } from './primitives';

export default function LandingFooter({ setInfo }) {
  return (
    <footer id="tentang-kami" className="bg-sakuText text-white py-12">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 pb-10 sm:pb-12 border-b border-sakuText-muted/40">
          <div className="sm:col-span-2 md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <Logo leaf="#B8D8C0" className="w-7 h-9"/>
              <div className="flex items-center text-xl font-bold tracking-widest">
                <span className="text-sakuPink">SAKU</span>
                <span className="text-emerald-100 ml-1.5">PUAN</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 max-w-md leading-relaxed">
              SAKUPUAN adalah platform pencatatan keuangan keluarga Indonesia
              yang membantu perempuan dan ibu rumah tangga mencatat keuangan
              serta memahami konteks perubahan belanja pangan secara bijak.
            </p>
          </div>
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sakuPink">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#cara-kerja" className="hover:text-white">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#fitur" className="hover:text-white">
                  Fitur Utama
                </a>
              </li>
              <li>
                <a href="#panduan" className="hover:text-white">
                  Panduan Telegram
                </a>
              </li>
            </ul>
          </div>
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sakuPink">
              Informasi
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button onClick={() => setInfo({
          title: "Kebijakan Privasi Saku Puan",
          body: "Saku Puan berkomitmen melindungi privasi data keuangan rumah tangga kamu. Seluruh catatan transaksi disimpan dengan enkripsi standar industri dan tidak dibagikan kepada pihak ketiga tanpa persetujuan eksplisit.",
      })} className="hover:text-white">
                  Kebijakan Privasi
                </button>
              </li>
              <li>
                <button onClick={() => setInfo({
          title: "Syarat & Ketentuan",
          body: "Layanan Saku Puan disediakan sebagai alat bantu pencatatan dan analisis independen. Informasi tren harga komoditas disajikan berdasarkan data acuan wilayah untuk tujuan pertimbangan kontekstual pengguna.",
      })} className="hover:text-white">
                  Syarat & Ketentuan
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3 text-center sm:text-left">
          <p>© 2026 SAKUPUAN. Hak Cipta Dilindungi Undang-Undang.</p>
          <p>Pencatatan Kontekstual untuk Keuangan Rumah Tangga</p>
        </div>
      </Container>
    </footer>
  );
}
