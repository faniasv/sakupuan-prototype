import "./globals.css";
import Navbar from "./components/shared/Navbar";

export const metadata = {
  title: "SakuPuan | Keuangan Rumah Tangga",
  description: "Pengelolaan keuangan personal yang lebih kontekstual bersama SakuPuan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-sakuIvory text-sakuText font-sans flex flex-col selection:bg-sakuPink-light selection:text-sakuPink">
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full mx-auto px-4 py-6 sm:py-8 max-w-250">
          {children}
        </main>
        
        {/* Global Footer (Visible only on Desktop for Dashboard) */}
        <footer className="hidden md:block bg-sakuGreen-dark text-white py-6 mt-auto border-t border-sakuGreen-light/40">
          <div className="max-w-250 mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">SAKUPUAN Platform</span>
            </div>
            <p>© 2026 SAKUPUAN. Asesmen Finansial & Pencatatan Kontekstual.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}