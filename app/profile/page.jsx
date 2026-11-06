"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfileMenuItem from "../components/profile/ProfileMenuItem";
import { Icons } from "../components/ui/Icons";

export default function ProfilePage() {
  const router = useRouter();

  const user = {
    name: "Vivin",
    email: "vivin@gmail.com",
    city: "Surabaya",
  };

  const handleLogout = () => {
    // Jika nanti sudah terintegrasi backend/Supabase, proses hapus session ditaruh di sini
    // Pasang routing client-side ke Dashboard (atau ke Landing Page '/')
    router.push("/dashboard");
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 fade-up">
      {/* Header Navigasi */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-xl text-sakuText hover:bg-sakuGreen-light">
          <Icons.Chevron className="w-5 h-5 rotate-180" />
        </Link>
        <h2 className="text-lg font-extrabold text-sakuText">Profil Pengguna</h2>
      </div>

      {/* Kartu Informasi Akun */}
      <section className="bg-linear-to-br from-sakuGreen to-sakuGreen-dark text-white p-6 rounded-3xl shadow-soft space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-sakuGreen-border text-sakuGreen-dark font-extrabold text-2xl flex items-center justify-center shadow-xs">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-base font-extrabold">{user.name}</h3>
          <p className="text-xs text-sakuGreen-border mt-0.5">{user.email}</p>
          <p className="text-[11px] text-sakuGreen-border/80 mt-1">Domisili: {user.city}</p>
        </div>
      </section>

      {/* Daftar Menu Pengaturan Profil */}
      <div className="space-y-2.5">
        <ProfileMenuItem
          icon={<Icons.Bulb className="w-5 h-5" />}
          label="Pengaturan Anggaran & Kategori"
          desc="Sesuaikan limit pengeluaran bulanan dan pos dapur"
          onClick={() => alert("Fitur pengaturan anggaran")}
        />
        <ProfileMenuItem
          icon={<Icons.Trend className="w-5 h-5" />}
          label="Notifikasi & Telegram Bot"
          desc="Hubungkan akun dengan bot pengingat pengeluaran"
          onClick={() => alert("Fitur integrasi Telegram")}
        />
        <ProfileMenuItem
          icon={<Icons.List className="w-5 h-5" />}
          label="Kebijakan Privasi & Keamanan"
          desc="Informasi perlindungan data keuangan rumah tangga"
          onClick={() => alert("Buka halaman privasi")}
        />
      </div>

      {/* Tombol Kembali / Keluar ke Dashboard */}
      <div className="pt-2">
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl border border-sakuGreen text-sakuGreen hover:bg-sakuGreen-light text-xs font-bold transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}