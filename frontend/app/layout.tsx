import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FreshAgent Hub — Performance-Optimized Support Interface",
  description: "High-performance customer support agent workspace designed for rapid ticket resolution workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans">
        {/* Minimal Application Shell Header */}
        <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20">
                FA
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-white tracking-tight">FreshAgent Hub</span>
                <span className="text-xs text-zinc-400">Support Workspace</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
              <span className="hover:text-zinc-200 cursor-not-allowed opacity-60" title="Future Route">
                Dashboard
              </span>
              <span className="hover:text-zinc-200 cursor-not-allowed opacity-60" title="Future Route">
                My Tickets
              </span>
              <span className="hover:text-zinc-200 cursor-not-allowed opacity-60" title="Future Route">
                Admin
              </span>
            </nav>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Frontend Online
              </span>
            </div>
          </div>
        </header>

        {/* Main Application Container */}
        <main className="flex-1">
          {children}
        </main>

        {/* Minimal Application Shell Footer */}
        <footer className="border-t border-zinc-800 bg-zinc-950 py-6">
          <div className="mx-auto max-w-7xl px-4 text-center text-xs text-zinc-500 sm:px-6 lg:px-8">
            <p>FreshAgent Hub — Performance-Optimized Support Interface &bull; Foundation Layer</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
