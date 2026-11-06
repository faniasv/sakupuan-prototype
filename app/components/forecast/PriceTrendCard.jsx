"use client";

export default function PriceTrendCard({ items }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold text-sakuText">Prediksi Tren Harga Pangan</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item, idx) => (
          <div key={idx} className="p-3.5 rounded-2xl bg-sakuIvory border border-sakuGreen-light flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-sakuText">{item.name}</p>
              <p className="text-[11px] text-sakuText-muted mt-0.5">{item.desc}</p>
            </div>
            <span
              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 ${
                item.trend === "up" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {item.trend === "up" ? "▲ Naik" : "▼ Stabil"} {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}