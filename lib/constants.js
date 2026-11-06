export const DEFAULT_CITY = "Surabaya";
export const CITIES = ["Surabaya", "Jakarta", "Bandung"];

// Action-plan categories and their accent colours.
export const CAT_COLORS = {
  "Makanan & minuman": "#2BA89A",
  "Investasi & Tabungan": "#1F5932",
  "Kebutuhan rumah tangga": "#E8743B",
  "Cicilan & utang": "#8B6FD6",
};
export const TASK_CATEGORIES = Object.keys(CAT_COLORS);

// Main navigation. `icon` is a key of the Icons object in components/ui/Icons.jsx.
export const NAV_ITEMS = [
  { href: "/dashboard", label: "Home", icon: "Home" },
  { href: "/insight", label: "Insight", icon: "Chart" },
  { href: "/forecast", label: "Prediksi", icon: "Trend" },
  { href: "/recommendation", label: "Rekomendasi", icon: "Bulb" },
  { href: "/action-plan", label: "Action Plan", icon: "List" },
];

// Pages that render without the main navigation (same rule as the old App.tsx).
export const NO_NAV_PREFIXES = ["/auth", "/assessment"];
// Pages that use the full-bleed layout on desktop.
export const WIDE_PREFIXES = ["/assessment", "/review"];
