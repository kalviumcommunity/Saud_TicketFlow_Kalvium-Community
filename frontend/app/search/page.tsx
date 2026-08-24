import React from "react";
import Link from "next/link";
import { getTickets } from "@/lib/api/tickets";
import { TicketFilters } from "@/components/TicketFilters";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Tickets — FreshAgent Hub",
  description: "Search customer tickets, emails, and issue details.",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    search?: string;
    status?: string;
    priority?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q || resolvedParams.search || "";
  const currentStatus = resolvedParams.status || "ALL";
  const currentPriority = resolvedParams.priority || "ALL";

  const { tickets } = await getTickets({
    search: searchQuery,
    status: currentStatus,
    priority: currentPriority,
    limit: 20,
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight">Search Support Desk</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Search across all customer tickets, customer names, and issue descriptions
        </p>
      </div>

      {/* URL Filter & Search Box */}
      <TicketFilters
        currentStatus={currentStatus}
        currentPriority={currentPriority}
        currentSearch={searchQuery}
      />

      {/* Search Results */}
      <div className="space-y-3">
        {searchQuery && (
          <div className="text-xs text-zinc-400">
            Showing results for &ldquo;<span className="text-indigo-400 font-semibold">{searchQuery}</span>&rdquo; ({tickets.length} matches)
          </div>
        )}

        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-indigo-500/50 hover:bg-zinc-900/90 transition-all cursor-pointer block"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-indigo-400 font-bold">{ticket.id}</span>
                    <span className="text-xs text-zinc-600">•</span>
                    <span className="text-xs text-zinc-300 font-medium">{ticket.customerCompany || ticket.customerName}</span>
                  </div>
                  <h2 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {ticket.title}
                  </h2>
                  <p className="text-xs text-zinc-400 line-clamp-1">{ticket.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded font-mono font-semibold border ${
                      ticket.priority === "URGENT"
                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        : ticket.priority === "HIGH"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                    }`}
                  >
                    {ticket.priority}
                  </span>

                  <span
                    className={`text-[11px] px-2.5 py-1 rounded font-medium border ${
                      ticket.status === "OPEN"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">
              {searchQuery ? `No tickets found matching "${searchQuery}"` : "Ready to search"}
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
              Enter search terms above or adjust filter chips to query customer tickets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
