import React from "react";

export default function TicketDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-5 border-b border-zinc-800">
        <div className="h-8 w-32 bg-zinc-800 rounded-lg" />
        <div className="h-6 w-24 bg-zinc-800 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 rounded-xl bg-zinc-900/60 border border-zinc-800" />
          <div className="h-64 rounded-xl bg-zinc-900/40 border border-zinc-800" />
        </div>
        <div className="space-y-5">
          <div className="h-44 rounded-xl bg-zinc-900/60 border border-zinc-800" />
          <div className="h-36 rounded-xl bg-zinc-900/40 border border-zinc-800" />
        </div>
      </div>
    </div>
  );
}
