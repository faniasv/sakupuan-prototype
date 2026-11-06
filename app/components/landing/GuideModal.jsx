'use client';

import Modal from '@/app/components/ui/Modal';

export default function GuideModal({ open, onClose, onStart }) {
  return (
    <Modal open={open} onClose={onClose} wide>
      <h3 className="text-xl font-bold mb-2 pr-6">
        Panduan Format Pesan Telegram
      </h3>
      <p className="text-xs text-sakuText-muted mb-4">
        Catat transaksi langsung dari pesan singkat dengan format natural
        berikut:
      </p>
      <div className="space-y-3 text-xs">
        {[
          [
              "Catat Pengeluaran Belanja:",
              ['"Belanja pasar 85.000"', '"Beli minyak goreng 2L 36.000"'],
          ],
          [
              "Catat Pemasukan:",
              ['"Gaji bulanan 4.500.000"', '"Pemasukan usaha kue 300.000"'],
          ],
          ["Cek Ringkasan Keuangan:", ['"/ringkasan"']],
      ].map(([t, ex]) => (<div key={t} className="p-3 bg-sakuIvory rounded-lg border border-sakuGreen-light">
            <p className="font-bold text-sakuGreen">{t}</p>
            {ex.map((e) => (<p key={e} className="text-gray-700 font-mono mt-1">
                {e}
              </p>))}
          </div>))}
      </div>
      <button onClick={() => {
          onStart();
      }} className="w-full mt-6 bg-sakuPink hover:bg-sakuPink-hover text-white font-semibold py-3 rounded-lg text-sm">
        Mulai Hubungkan Sekarang
      </button>
    </Modal>
  );
}
