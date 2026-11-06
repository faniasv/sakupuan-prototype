"use client";

export default function RecommendationCard({ recommendation, onAction }) {
  return (
    <div className="p-4 sm:p-5 rounded-3xl bg-white border border-sakuGreen-light shadow-soft space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sakuPink bg-sakuPink-light px-2.5 py-1 rounded-full">
            {recommendation.category}
          </span>
          <h3 className="text-sm font-extrabold text-sakuText mt-2">
            {recommendation.title}
          </h3>
        </div>
      </div>
      <p className="text-xs text-sakuText-muted leading-relaxed">
        {recommendation.description}
      </p>
      <div className="pt-2 flex items-center justify-between border-t border-sakuGreen-light/60">
        <span className="text-[11px] font-semibold text-sakuGreen">
          Estimasi Hemat: {recommendation.savingEstimate}
        </span>
        <button
          onClick={() => onAction(recommendation.id)}
          className="text-xs font-bold bg-sakuGreen hover:bg-sakuGreen-hover text-white px-4 py-2 rounded-xl transition-all"
        >
          Terapkan Saran
        </button>
      </div>
    </div>
  );
}