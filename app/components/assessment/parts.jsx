"use client";

export const CARD =
  "max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#EAF3EC] space-y-6 animate-in fade-in md:max-w-none md:w-full md:rounded-none md:shadow-none md:border-0 md:bg-transparent md:px-10 lg:px-16 md:py-10";

export function AssessmentCard({ children, bigText }) {
  return <div className={`${CARD} ${bigText ? "" : "md:[&_.text-xs]:text-sm"}`}>{children}</div>;
}

export function StepHeader({ eyebrow, title, desc, green, big }) {
  return (
    <div className={`border-b border-gray-100 pb-3 ${big ? "md:pb-6" : ""}`}>
      <span className={`text-xs ${big ? "md:text-sm" : ""} font-bold ${green ? "text-[#1F5932]" : "text-[#FF4B93]"} uppercase tracking-wider`}>{eyebrow}</span>
      <h2 className={`${big ? "text-xl sm:text-2xl md:text-4xl md:mt-2" : "text-xl sm:text-2xl"} font-extrabold text-[#1E2D24] mt-1`}>{title}</h2>
      <p className={`text-xs ${big ? "md:text-base md:mt-2 md:max-w-3xl" : ""} text-[#485A50] mt-1`}>{desc}</p>
    </div>
  );
}

/** One scored question: a label and a list of options (score -> text). */
export function QuestionBlock({ question, value, onChange }) {
  return (
    <div className="p-4 rounded-2xl bg-[#FBF8F5] border border-[#EAF3EC] space-y-3">
      <label className="block font-bold text-[#1E2D24]">{question.text}</label>
      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt.score}
            type="button"
            onClick={() => onChange(opt.score)}
            className={`w-full p-3 rounded-xl border text-left font-bold transition-all ${
              value === opt.score
                ? "bg-[#1F5932] text-white border-[#1F5932]"
                : "bg-white border-gray-200 text-[#1E2D24] hover:border-[#1F5932]"
            }`}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MoneyInput({ value, onChange, tone = "green" }) {
  const border = tone === "pink" ? "border-[#FFC2DC] text-[#FF4B93]" : "border-[#B8D8C0]";
  const prefix = tone === "pink" ? "text-[#FF4B93]" : "text-[#1F5932]";
  return (
    <div className="relative">
      <span className={`absolute left-3.5 top-2.5 font-bold ${prefix}`}>Rp</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full pl-10 pr-3.5 py-2 rounded-xl border ${border} font-bold bg-white focus:outline-none`}
      />
    </div>
  );
}

export function StepNav({ onBack, onNext, nextLabel, pink, busy, error }) {
  return (
    <>
      {error && (
        <p role="alert" className="text-xs font-semibold text-sakuPink-dark">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        {onBack && (
          <button onClick={onBack} className="w-1/3 py-3 border rounded-xl text-xs font-bold text-gray-600">
            Kembali
          </button>
        )}
        <button
          onClick={onNext}
          disabled={busy}
          className={`${onBack ? "w-2/3" : "w-full"} ${
            pink ? "bg-[#FF4B93] hover:bg-[#E0367B] shadow-lg" : "bg-[#1F5932] hover:bg-[#164324] shadow-md"
          } disabled:opacity-60 text-white font-bold py-3 rounded-xl text-xs transition-transform active:scale-98`}
        >
          {busy ? "Menghitung..." : nextLabel}
        </button>
      </div>
    </>
  );
}
