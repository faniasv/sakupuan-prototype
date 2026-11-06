const SvgWrapper = ({ children, className = "w-5 h-5", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
);

export const Icons = {
  Home: ({ className }) => <SvgWrapper className={className}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></SvgWrapper>,
  Chart: ({ className }) => <SvgWrapper className={className}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></SvgWrapper>,
  Trend: ({ className }) => <SvgWrapper className={className}><path d="M3 17l6-6 4 4 8-8M15 7h6v6" /></SvgWrapper>,
  Bulb: ({ className }) => <SvgWrapper className={className}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z" /></SvgWrapper>,
  List: ({ className }) => <SvgWrapper className={className}><path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" /></SvgWrapper>,
  Bot: ({ className }) => <SvgWrapper className={className}><rect x="4" y="8" width="16" height="12" rx="3" /><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6" /></SvgWrapper>,
  Menu: ({ className }) => <SvgWrapper className={className}><path d="M4 7h16M4 12h16M4 17h16" /></SvgWrapper>,
  Close: ({ className }) => <SvgWrapper className={className}><path d="M6 18 18 6M6 6l12 12" /></SvgWrapper>,
  Bell: ({ className }) => <SvgWrapper className={className}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></SvgWrapper>,
  Chevron: ({ className }) => <SvgWrapper className={className}><path d="m9 18 6-6-6-6" /></SvgWrapper>,
  Send: ({ className }) => <SvgWrapper className={className}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></SvgWrapper>,
  Telegram: ({ className }) => <SvgWrapper className={className}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" /></SvgWrapper>,
  Sparkles: ({ className }) => <SvgWrapper className={className}><path d="M5 15a7 7 0 0 1 14 0M12 3v4M3 12h4M17 12h4M12 17v4" /></SvgWrapper>
};