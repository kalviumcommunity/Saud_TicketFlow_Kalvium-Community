import React, { useState } from "react";

export function SearchView({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [filterPriority, setFilterPriority] = useState<string>("ALL");

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight">Search Support Desk</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Search across all customer tickets, customer names, and issue descriptions
        </p>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tickets by ID, title, keyword or customer..."
          className="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-zinc-400 font-medium mr-1">Filter Priority:</span>
        {["ALL", "URGENT", "HIGH", "MEDIUM", "LOW"].map((priority) => (
          <button
            key={priority}
            type="button"
            onClick={() => setFilterPriority(priority)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              filterPriority === priority
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50"
            }`}
          >
            {priority}
          </button>
        ))}
      </div>

      {/* Search Results Placeholder */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">
          {query ? `Search results for "${query}"` : "Ready to search"}
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
          Enter a search term above or select filter chips to locate matching tickets in the support workspace.
        </p>
      </div>
    </div>
  );
}
