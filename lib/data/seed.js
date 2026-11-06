// Seed data for new users. Replace with real queries once a database exists.

export const INITIAL_TASKS = [
  {
    title: "Nabung Dana Darurat Rp 200.000",
    cat: "Investasi & Tabungan",
    done: false,
    amount: 200000,
    note: "Sisihkan di awal gajian ke rekening terpisah.",
  },
  {
    title: "Bayar Tagihan Listrik Tepat Waktu",
    cat: "Kebutuhan rumah tangga",
    done: true,
  },
];

export const PERIODS = [
  { key: "2026-08", label: "1 Agu 2026 - 31 Agu 2026" },
  { key: "2026-09", label: "1 Sep 2026 - 30 Sep 2026" },
];

export const ACCOUNTS = [
  { id: "all", label: "Semua tabungan & giro" },
  { id: "tabungan", label: "Tabungan Utama" },
  { id: "giro", label: "Giro Rumah Tangga" },
];

// flow: 'in' | 'out'. `cat` is a key of CATEGORIES in lib/categories.js.
export const SEED_TRANSACTIONS = [
  // September 2026
  { period: "2026-09", flow: "out", cat: "uang-keluar", title: "Transfer ke Ibu", date: "12 Sep 2026", amount: 56000, account: "tabungan" },
  { period: "2026-09", flow: "out", cat: "transportasi", title: "Ojol ke pasar", date: "9 Sep 2026", amount: 31200, account: "tabungan" },
  { period: "2026-09", flow: "out", cat: "top-up", title: "Top-up e-wallet", date: "5 Sep 2026", amount: 30000, account: "tabungan" },
  { period: "2026-09", flow: "out", cat: "makanan", title: "Jajan bakso", date: "14 Sep 2026", amount: 10000, account: "giro" },
  { period: "2026-09", flow: "out", cat: "biaya", title: "Biaya admin bulanan", date: "1 Sep 2026", amount: 5000, account: "giro" },
  // Agustus 2026
  { period: "2026-08", flow: "in", cat: "gaji", title: "Gaji bulanan", date: "25 Agu 2026", amount: 5500000, account: "tabungan" },
  { period: "2026-08", flow: "in", cat: "uang-masuk", title: "Jualan kue", date: "17 Agu 2026", amount: 350000, account: "giro" },
  { period: "2026-08", flow: "out", cat: "belanja-dapur", title: "Belanja bulanan", date: "1 Agu 2026", amount: 1250000, account: "tabungan" },
  { period: "2026-08", flow: "out", cat: "belanja-dapur", title: "Sayur & bumbu pasar", date: "8 Agu 2026", amount: 250000, account: "giro" },
  { period: "2026-08", flow: "out", cat: "belanja-dapur", title: "Belanja mingguan", date: "15 Agu 2026", amount: 300000, account: "giro" },
  { period: "2026-08", flow: "out", cat: "tagihan", title: "Listrik PLN", date: "3 Agu 2026", amount: 420000, account: "tabungan" },
  { period: "2026-08", flow: "out", cat: "tagihan", title: "Air PDAM", date: "3 Agu 2026", amount: 95000, account: "tabungan" },
  { period: "2026-08", flow: "out", cat: "pendidikan", title: "SPP sekolah", date: "5 Agu 2026", amount: 350000, account: "tabungan" },
  { period: "2026-08", flow: "out", cat: "transportasi", title: "Bensin motor", date: "10 Agu 2026", amount: 120000, account: "giro" },
  { period: "2026-08", flow: "out", cat: "transportasi", title: "Ojol ke pasar", date: "20 Agu 2026", amount: 28000, account: "giro" },
  { period: "2026-08", flow: "out", cat: "kesehatan", title: "Vitamin anak", date: "12 Agu 2026", amount: 85000, account: "giro" },
  { period: "2026-08", flow: "out", cat: "biaya", title: "Biaya admin bulanan", date: "1 Agu 2026", amount: 5000, account: "tabungan" },
];
