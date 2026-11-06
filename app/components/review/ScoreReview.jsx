'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/app/components/providers/AppProvider';
import { Icons } from '@/app/components/ui/Icons';
import { CATEGORY_STYLES, pillarStatus } from '@/lib/scoring';

export default function ScoreReview() {
  const router = useRouter();
  const { score, user } = useApp();
  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#EAF3EC] text-center space-y-6 animate-in zoom-in-95 md:max-w-none md:w-full md:rounded-none md:shadow-none md:border-0 md:bg-transparent md:px-10 lg:px-16 md:py-10 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-8 md:space-y-0 md:items-start md:text-sm">
                <div className="w-16 h-16 rounded-2xl bg-[#FFF0F6] text-[#FF4B93] flex items-center justify-center mx-auto text-3xl">
                  <Icons.Sparkles className="w-8 h-8"/>
                </div>

                {/* Lapis 1: Status Emotion Badge */}
                <div className="space-y-1.5">
                  <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${CATEGORY_STYLES[score.category]}`}>
                    {score.label}
                  </div>
                  <p className="text-xs text-[#485A50]">{score.tagline}</p>
                </div>

                {/* Lapis 2: Angka & Label Baseline */}
                <div>
                  <p className="text-xs font-semibold text-[#6E8276]">
                    Skor Awal {user.name}
                  </p>
                  <p className="text-3xl font-extrabold text-[#1E2D24] mt-0.5">
                    {score.totalScore}
                    <span className="text-base text-[#6E8276] font-semibold">
                      /100
                    </span>
                  </p>
                  <p className="text-[11px] text-[#6E8276]">(Estimasi Awal)</p>
                </div>

                {/* Lapis 3: Mikro-Apresiasi + Action Step */}
                <div className="p-4 rounded-2xl bg-[#FBF8F5] border border-[#EAF3EC] text-left space-y-2 text-xs">
                  <p className="font-bold text-[#1F5932]">
                    {" "}
                    Insight Mimin SAKUPUAN:
                  </p>
                  <p className="text-[#485A50] leading-relaxed">
                    {score.insight}
                  </p>
                </div>

                {/* Rincian 4 Pilar, pilar terkuat ditampilkan duluan */}
                <div className="text-left space-y-2">
                  <p className="text-xs font-bold text-[#1E2D24]">
                    {" "}
                    Rincian 4 Pilar Dapur Puan
                  </p>
                  {[...score.pillars]
                    .sort((x, y) => y.value - x.value)
                    .map((pl) => (<div key={pl.key} className={`flex items-center justify-between p-3 rounded-xl border text-xs ${pl.key === score.best.key
                        ? "bg-[#EAF3EC] border-[#B8D8C0]"
                        : "bg-white border-gray-200"}`}>
                        <span className="text-[#485A50]">
                          {pl.name}{" "}
                          <span className="text-[10px] text-[#6E8276]">
                            ({pl.code})
                          </span>
                        </span>
                        <span className="text-right">
                          <span className="font-bold text-[#1F5932]">
                            {pl.value}/100
                          </span>
                          <span className="block text-[10px] text-[#6E8276]">
                            {pillarStatus(pl.value)}
                          </span>
                        </span>
                      </div>))}
                </div>

                {/* 2 AJAKAN UTAMA SESUAI SPESIFIKASI */}
                <div className="space-y-2 pt-2">
                  {/* Ajakan 1: Connect Telegram */}
                  <button onClick={() => router.push("/telegram")} className="w-full bg-[#FF4B93] hover:bg-[#E0367B] text-white font-bold py-3.5 rounded-xl shadow-md text-xs transition-transform active:scale-98 flex items-center justify-center gap-2">
                    <Icons.Telegram className="w-4 h-4"/>
                    Catat Belanja via Telegram (Biar Akurat)
                  </button>

                  <button onClick={() => router.push("/dashboard")} className="w-full text-xs text-[#6E8276] hover:underline pt-2 block">
                    Langsung Masuk ke Dashboard Utama
                  </button>
                </div>
              </div>
  );
}
