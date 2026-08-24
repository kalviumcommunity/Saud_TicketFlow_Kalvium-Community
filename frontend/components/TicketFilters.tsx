"use client";

import React, { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface TicketFiltersProps {
  currentStatus: string;
  currentPriority: string;
  currentSearch: string;
}

export function TicketFilters({
  currentStatus = "ALL",
  currentPriority = "ALL",
  currentSearch = "",
}: TicketFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchValue, setSearchValue] = useState(currentSearch);

  const updateQueryParams = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 whenever filters change
    params.set("page", "1");

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "ALL" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParams({ search: searchValue });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Box */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Filter list by ID, title, customer, description..."
            className="w-full pl-9 pr-16 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isPending}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Tickets" },
            { id: "OPEN", label: "Open" },
            { id: "IN_PROGRESS", label: "In Progress" },
            { id: "RESOLVED", label: "Resolved" },
            { id: "URGENT", label: "Urgent Priority" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => updateQueryParams({ status: tab.id })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                currentStatus === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority Secondary Filter Bar */}
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <span className="font-medium text-zinc-500">Priority Filter:</span>
        {["ALL", "LOW", "MEDIUM", "HIGH", "URGENT"].map((pri) => (
          <button
            key={pri}
            type="button"
            onClick={() => updateQueryParams({ priority: pri })}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono transition-colors ${
              currentPriority === pri
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
            }`}
          >
            {pri}
          </button>
        ))}

        {(currentStatus !== "ALL" || currentPriority !== "ALL" || currentSearch) && (
          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              router.push(pathname);
            }}
            className="ml-auto text-[11px] text-rose-400 hover:underline font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
}
