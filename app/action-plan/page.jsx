"use client";
import { useState } from "react";
import Link from "next/link";
import TaskCard from "../components/action-plan/TaskCard";
import { Icons } from "../components/ui/Icons";

const INITIAL_TASKS = [
  {
    id: 1,
    title: "Buat Daftar Belanja Mingguan",
    desc: "Tulis menu makanan 7 hari ke depan sebelum pergi ke pasar agar terhindar dari pembelian impulsif.",
    completed: true,
  },
  {
    id: 2,
    title: "Sisihkan Tabungan di Awal Gajian",
    desc: "Pindahkan minimal 10% dari pemasukan bulanan ke pos tabungan darurat segera setelah uang masuk.",
    completed: false,
  },
  {
    id: 3,
    title: "Cek Ulang Tagihan Layanan Bulanan",
    desc: "Periksa kembali langganan digital atau utilitas yang tidak terlalu penting untuk ditekan.",
    completed: false,
  },
];

export default function ActionPlanPage() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="max-w-xl mx-auto space-y-4 fade-up">
      {/* Header Navigasi */}
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="p-2 -ml-2 rounded-xl text-sakuText hover:bg-sakuGreen-light">
          <Icons.Chevron className="w-5 h-5 rotate-180" />
        </Link>
        <h2 className="text-lg font-extrabold text-sakuText">Action Plan Keuangan</h2>
      </div>

      {/* Progress Bar Card */}
      <section className="bg-white rounded-3xl border border-sakuGreen-light p-5 space-y-3 shadow-soft">
        <div className="flex justify-between text-xs font-bold text-sakuText">
          <span>Progress Minggu Ini</span>
          <span>{completedCount} dari {tasks.length} Selesai</span>
        </div>
        <div className="w-full bg-sakuIvory h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-sakuGreen h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </section>

      {/* Daftar Task */}
      <div className="space-y-2.5">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}