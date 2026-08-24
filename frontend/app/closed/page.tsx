import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Closed Tickets — FreshAgent Hub",
  description: "Archived customer support tickets successfully resolved.",
};

export default function ClosedTicketsPage() {
  const closedTickets = [
    {
      id: "TCK-1028",
      title: "TLS Certificate renewal verification",
      customer: "Global Systems",
      resolvedAt: "Yesterday at 4:15 PM",
      resolution: "Renewed wildcard cert & verified SSL handshake",
    },
    {
      id: "TCK-1024",
      title: "Webhook delivery failure alerts",
      customer: "Datastream Inc",
      resolvedAt: "Aug 16, 2026",
      resolution: "Re-queued dropped payload notifications",
    },
    {
      id: "TCK-1019",
      title: "User invitation email link expired",
      customer: "Apex Ventures",
      resolvedAt: "Aug 15, 2026",
      resolution: "Resent verification magic link to admin email",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Closed & Resolved Tickets</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Archived customer support tickets successfully resolved
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-700">
            3 Resolved Recently
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {closedTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-5 hover:border-zinc-700/80 transition-colors opacity-85 hover:opacity-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-zinc-500 font-semibold">{ticket.id}</span>
                  <span className="text-xs text-zinc-600">•</span>
                  <span className="text-xs text-zinc-400 font-medium">{ticket.customer}</span>
                </div>
                <h2 className="text-sm font-semibold text-zinc-200">{ticket.title}</h2>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                  <span className="text-zinc-500 font-medium">Resolution: </span>
                  {ticket.resolution}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs px-2.5 py-1 rounded font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/50 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Resolved
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
