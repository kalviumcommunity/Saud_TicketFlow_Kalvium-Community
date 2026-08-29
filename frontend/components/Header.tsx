"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getStoredUser, logout } from "@/lib/api/auth";
import { User } from "@/types";
import { LogOut, User as UserIcon, LogIn } from "lucide-react";

export type NavItem = "dashboard" | "my-tickets" | "closed-tickets" | "search" | "settings";

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

export function Header({ onToggleMobileSidebar }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement;
      if (target.value.trim()) {
        router.push(`/search?q=${encodeURIComponent(target.value.trim())}`);
      }
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    router.push("/login");
    router.refresh();
  };

  const getInitials = (name: string) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left side: Hamburger button + Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label="Open sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition-transform">
            FA
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight text-sm sm:text-base group-hover:text-indigo-400 transition-colors">
              FreshAgent Hub
            </span>
            <span className="text-[11px] text-zinc-400 leading-none">Support Workspace</span>
          </div>
        </Link>
      </div>

      {/* Middle: Quick Search Input (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="w-full relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search tickets..."
            onKeyDown={handleSearchKeyDown}
            className="w-full pl-9 pr-12 py-1.5 bg-zinc-900/90 border border-zinc-800 focus:border-indigo-500 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none transition-colors shadow-inner"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700 pointer-events-none">
            Enter
          </kbd>
        </div>
      </div>

      {/* Right side: Status Badge & Profile / Logout */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          PostgreSQL Active
        </span>

        {currentUser ? (
          <div className="flex items-center gap-3 pl-2 border-l border-zinc-800">
            <div className="h-8 w-8 rounded-full bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-xs">
              {getInitials(currentUser.name)}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-zinc-200">{currentUser.name}</span>
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider">{currentUser.role}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
  );
}
