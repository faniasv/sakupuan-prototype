// Recommendation catalogue. The first 3 are always shown; EXTRA_RECS are
// revealed two at a time by POST /api/recommendations/generate.
// TODO: replace with output from the AI service (RAG + price trends).

export const GROUPS = [
  { id: "pangan", label: "Belanja Pangan" },
  { id: "tabung", label: "Menabung" },
  { id: "utang", label: "Utang & Cicilan" },
];

export const recsFor = (city) => [
  {
    id: 1,
    group: "pangan",
    tag: "Belanja Pangan",
    impact: "Hemat: Rp 45.000 / bln",
    title: `Cabai Merah Naik 8% di ${city}! Switch ke Cabai Kering 🌶️`,
    desc: "Harga cabai rawit & merah sedang melonjak minggu ini. Mengganti 50% konsumsi dengan cabai kering atau sambal olahan matang.",
    task: { title: "Beli Cabai Kering / Sambal Olahan", cat: "Makanan & minuman", amount: 45000, note: "Ganti 50% cabai segar dengan cabai kering atau sambal matang selama harga naik." },
  },
  {
    id: 2,
    group: "tabung",
    tag: "Menabung & Dana Darurat",
    impact: "Tabungan: Rp 1.8M / thn",
    title: "Autodebit Rp 150rb di H+1 Hilal Gajian 💰",
    desc: "Menyisihkan dana darurat otomatis di awal bulan sebelum terpakai untuk belanja sekunder.",
    task: { title: "Autodebit Dana Darurat Rp 150.000", cat: "Investasi & Tabungan", amount: 150000, note: "Atur autodebit sehari setelah gajian masuk." },
  },
  {
    id: 3,
    group: "utang",
    tag: "Utang & Cicilan",
    impact: "Hemat bunga: Rp 60.000 / bln",
    title: "Lunasi Paylater Berbunga Tertinggi Dulu",
    desc: "Fokuskan pembayaran ekstra ke cicilan dengan bunga paling besar, sisanya bayar minimum tepat waktu.",
    task: { title: "Lunasi Paylater Berbunga Tertinggi", cat: "Cicilan & utang", amount: 60000, note: "Bayar ekstra ke cicilan bunga tertinggi, sisanya bayar minimum." },
  },
];

export const EXTRA_RECS = [
  {
    id: 4,
    group: "pangan",
    tag: "Belanja Pangan",
    impact: "Hemat: Rp 20.000 / bln",
    title: "Telur Lagi Turun 2%, Stok Lauk Protein Minggu Ini",
    desc: "Harga telur ayam sedang turun. Beli untuk kebutuhan 1–2 minggu dan simpan di suhu ruang yang sejuk.",
    task: { title: "Stok Telur Saat Harga Turun", cat: "Makanan & minuman", amount: 20000, note: "Beli telur untuk 1–2 minggu selagi harga turun." },
  },
  {
    id: 5,
    group: "tabung",
    tag: "Menabung & Dana Darurat",
    impact: "Tabungan: Rp 600rb / thn",
    title: "Celengan Kembalian Belanja Harian",
    desc: "Sisihkan uang kembalian belanja pasar setiap hari ke celengan khusus, setor ke rekening tiap akhir bulan.",
    task: { title: "Sisihkan Kembalian ke Celengan", cat: "Investasi & Tabungan", amount: 50000, note: "Setor isi celengan ke rekening tiap akhir bulan." },
  },
  {
    id: 6,
    group: "pangan",
    tag: "Belanja Pangan",
    impact: "Hemat: Rp 35.000 / bln",
    title: "Belanja Mingguan di Pasar Pagi, Bukan Harian",
    desc: "Rencanakan menu seminggu lalu belanja sekali di pasar pagi. Mengurangi belanja impulsif dan ongkos bolak-balik.",
    task: { title: "Belanja Mingguan di Pasar Pagi", cat: "Makanan & minuman", amount: 35000, note: "Susun menu seminggu sebelum belanja." },
  },
  {
    id: 7,
    group: "utang",
    tag: "Utang & Cicilan",
    impact: "Hemat: Rp 75.000 / bln",
    title: "Nonaktifkan Paylater di Aplikasi Belanja",
    desc: "Matikan opsi paylater di aplikasi belanja online agar pembelian tidak terencana tidak jadi cicilan baru.",
    task: { title: "Nonaktifkan Paylater Belanja Online", cat: "Cicilan & utang", amount: 75000, note: "Matikan paylater di semua aplikasi belanja." },
  },
];
