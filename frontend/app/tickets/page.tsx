import React from "react";
import Link from "next/link";
import { getTickets } from "@/lib/api/tickets";
import { TicketFilters } from "@/components/TicketFilters";
import { PaginationControls } from "@/components/PaginationControls";
import { DashboardClient } from "@/components/DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Assigned Tickets — FreshAgent Hub",
  description: "Browse and filter support tickets in your assigned queue.",
};

interface TicketsPageProps {
  searchParams: Promise<{
    status?: string;
    priority?: string;
    search?: string;
    q?: string;
    page?: string;
  }>;
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const resolvedParams = await searchParams;

  const currentStatus = resolvedParams.status || "ALL";
  const currentPriority = resolvedParams.priority || "ALL";
  const currentSearch = resolvedParams.search || resolvedParams.q || "";
  const currentPage = parseInt(resolvedParams.page || "1", 10);

  const { tickets, pagination } = await getTickets({
    status: currentStatus,
    priority: currentPriority,
    search: currentSearch,
    page: currentPage,
    limit: 5,
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">My Assigned Tickets</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Active customer support requests (URL Filter & Search Sync)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
            {pagination.total} Tickets Found
          </span>
          <DashboardClient />
        </div>
      </div>

      {/* URL Filter & Search Controls */}
      <TicketFilters
        currentStatus={currentStatus}
        currentPriority={currentPriority}
        currentSearch={currentSearch}
      />

      {/* Ticket List */}
      <div className="space-y-3">
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Link
              key={ticket.id}
              href={`/tickets/${ticket.id}`}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-indigo-500/50 hover:bg-zinc-900/90 transition-all cursor-pointer shadow-sm hover:shadow-lg block"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-indigo-400 font-bold group-hover:text-indigo-300 transition-colors">
                      {ticket.id}
                    </span>
                    <span className="text-xs text-zinc-600">•</span>
                    <span className="text-xs font-medium text-zinc-300">
                      {ticket.customerCompany || ticket.customerName}
                    </span>
                    {ticket.tags && ticket.tags.length > 0 && (
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/50">
                        #{ticket.tags[0]}
                      </span>
                    )}
                  </div>

                  <h2 className="text-base font-semibold text-white group-hover:text-indigo-200 transition-colors">
                    {ticket.title}
                  </h2>

                  <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                    <span>Customer: {ticket.customerName}</span>
                    <span>•</span>
                    <span>{ticket.repliesCount || ticket.replies?.length || 0} replies</span>
                    <span>•</span>
                    <span>
                      Updated{" "}
                      {new Date(ticket.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded font-mono font-semibold border ${
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
                    className={`text-xs px-2.5 py-1 rounded font-medium border ${
                      ticket.status === "OPEN"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    }`}
                  >
                    {ticket.status}
                  </span>

                  <div className="text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all pl-1">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">No tickets found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
              No tickets matched your query parameters. Try resetting your search filters or create a new ticket.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <PaginationControls pagination={pagination} />
    </div>
  );
}
