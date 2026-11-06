"use client";

import { usePathname } from "next/navigation";
import AppHeader from "./components/ui/AppHeader";
import "./globals.css";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  // Hanya tampilkan AppHeader jika BUKAN berada di halaman Landing Page ('/')
  const isAppPage = pathname !== "/";

  return (
    <html lang="id">
      <body className="bg-sakuIvory text-sakuText antialiased">
        {isAppPage && <AppHeader />}
        <main>{children}</main>
      </body>
    </html>
  );
}