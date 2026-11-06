// Rule-based fallback for the AI Advisor. POST /api/advisor/chat calls the real
// AI service first (lib/aiService.js) and falls back to this when it is not
// configured or fails, so the chat always answers.

export function advisorReply(message, city) {
  const t = String(message).toLowerCase();

  if (/(cabai|cabe|sayur|harga|beras|telur|masak|belanja)/.test(t))
    return {
      text: `Selain cabai, harga beras dan telur di ${city} masih stabil. Masak sambal sekaligus untuk seminggu juga bikin gas dan bumbu lebih irit, Puan.`,
      suggestion: {
        title: "Masak Sambal Sekali Seminggu",
        desc: "Hemat gas dan bumbu sampai 15% per bulan.",
        cat: "Makanan & minuman",
      },
    };
  if (/(nabung|tabung|darurat|investasi)/.test(t))
    return {
      text: "Mulai dari yang kecil dulu ya. Sisihkan 10% di awal gajian, bukan dari sisa. Target dana darurat idealnya 3 sampai 6 bulan pengeluaran rutin.",
      suggestion: {
        title: "Sisihkan 10% di Awal Gajian",
        desc: "Langsung pindahkan ke rekening terpisah begitu gaji masuk.",
        cat: "Investasi & Tabungan",
      },
    };
  if (/(utang|cicil|paylater|pinjol|kredit)/.test(t))
    return {
      text: "Usahakan total cicilan maksimal 30% dari pemasukan bulanan. Kalau ada beberapa, lunasi yang bunganya paling besar dulu.",
      suggestion: {
        title: "Lunasi Cicilan Bunga Tertinggi Dulu",
        desc: "Kurangi beban bunga bulanan lebih cepat.",
        cat: "Cicilan & utang",
      },
    };
  if (/(budget|anggaran|bagi|gaji|listrik|tagihan)/.test(t))
    return {
      text: "Coba pola 50/30/20: 50% kebutuhan pokok, 30% keinginan, 20% tabungan. Tagihan rutin seperti listrik masuk ke kebutuhan pokok.",
      suggestion: {
        title: "Atur Anggaran Pola 50/30/20",
        desc: "Pisahkan pos kebutuhan, keinginan, dan tabungan tiap gajian.",
        cat: "Kebutuhan rumah tangga",
      },
    };
  return {
    text: "Mimin siap bantu soal belanja dapur, tabungan, cicilan, atau atur anggaran. Coba ceritain lebih detail ya, Puan.",
  };
}
