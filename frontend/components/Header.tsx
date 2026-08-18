import React from "react";

export type NavItem = "dashboard" | "my-tickets" | "closed-tickets" | "search" | "settings";

interface HeaderProps {
  activeNav: NavItem;
  onSelectNav: (nav: NavItem) => void;
  onToggleMobileSidebar: () => void;
}

export function Header({
  activeNav,
  onSelectNav,
  onToggleMobileSidebar,
}: HeaderProps) {
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

        <div
          onClick={() => onSelectNav("dashboard")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition-transform">
            FA
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white tracking-tight text-sm sm:text-base group-hover:text-indigo-400 transition-colors">
              FreshAgent Hub
            </span>
            <span className="text-[11px] text-zinc-400 leading-none">Support Workspace</span>
          </div>
        </div>
      </div>

      {/* Middle: Quick Search Input (Desktop) */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div
          onClick={() => onSelectNav("search")}
          className="w-full relative cursor-pointer"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div className="w-full pl-9 pr-4 py-1.5 bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-lg text-xs text-zinc-400 flex items-center justify-between transition-colors shadow-inner">
            <span>Search tickets...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right side: Status Badge & Profile Badge */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Frontend Online
        </span>

        <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="h-8 w-8 rounded-full bg-indigo-900/60 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-semibold text-xs">
            AA
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-medium text-zinc-200">Agent Alex</span>
            <span className="text-[10px] text-zinc-400">Support Lead</span>
          </div>
        </div>
      </div>
    </header>
  );
}
