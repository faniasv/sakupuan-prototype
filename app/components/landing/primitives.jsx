export const Check = ({ className = "" }) => (<svg className={`w-4 h-4 ${className}`} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
  </svg>);
export const Arrow = ({ className = "w-5 h-5" }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
  </svg>);
export const Container = ({ children }) => (<div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">{children}</div>);
export const SectionHead = ({ eyebrow, title, desc, pink, }) => (<div className="text-center max-w-2xl mx-auto space-y-3">
    <span className={`text-xs font-bold uppercase tracking-wider ${pink ? "text-sakuPink" : "text-sakuGreen"}`}>
      {eyebrow}
    </span>
    <h2 className="text-2xl sm:text-3xl font-bold text-sakuText text-balance">
      {title}
    </h2>
    <p className="text-base text-sakuText-muted leading-relaxed">{desc}</p>
  </div>);
