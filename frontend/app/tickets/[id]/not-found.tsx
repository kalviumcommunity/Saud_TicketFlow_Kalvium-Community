import React from "react";
import Link from "next/link";

export default function TicketNotFound() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-12 text-center space-y-4">
      <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div>
        <h2 className="text-lg font-bold text-white tracking-tight">Ticket Not Found</h2>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1">
          The ticket identifier you requested does not exist in the database or fallback queue.
        </p>
      </div>

      <div>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20"
        >
          <span>Back to Ticket Queue</span>
        </Link>
      </div>
    </div>
  );
}
