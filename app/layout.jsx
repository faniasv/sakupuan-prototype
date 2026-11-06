import { Inter } from "next/font/google";
import "./globals.css";
import AppProvider from "@/app/components/providers/AppProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: { default: "SAKUPUAN - Dompet Tenang, Dompet Senang", template: "%s · SAKUPUAN" },
  description:
    "SAKUPUAN membantu mencatat pemasukan dan pengeluaran, memantau belanja pangan, dan memahami dampak perubahan harga pangan bagi keuangan rumah tangga.",
};

export const viewport = { themeColor: "#1F5932" };

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
