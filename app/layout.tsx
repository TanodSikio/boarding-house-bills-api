import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tindahan Ledger",
  description: "Customer balances, dues, and payment history.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="flex items-center gap-8 border-b border-neutral-200 px-6 py-4">
          <Link href="/" className="font-semibold">Tindahan Ledger</Link>
          <Link href="/customers" className="text-neutral-600 hover:text-neutral-950">Customers</Link>
          <Link href="/login" className="ml-auto text-neutral-600 hover:text-neutral-950">Sign in</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
