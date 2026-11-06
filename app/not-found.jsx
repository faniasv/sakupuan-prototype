import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-2xl font-extrabold text-sakuText">Halaman tidak ditemukan</h1>
      <Link href="/" className="text-sm font-bold text-sakuGreen hover:underline">Kembali ke beranda</Link>
    </div>
  );
}
