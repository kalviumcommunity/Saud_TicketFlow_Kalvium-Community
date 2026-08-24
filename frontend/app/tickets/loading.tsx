import React from "react";

export default function TicketsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between pb-5 border-b border-zinc-800">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-zinc-800 rounded-lg" />
          <div className="h-4 w-64 bg-zinc-900 rounded-lg" />
        </div>
        <div className="h-9 w-28 bg-indigo-900/40 rounded-xl" />
      </div>

      <div className="h-10 w-full bg-zinc-900 rounded-xl border border-zinc-800" />

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-zinc-900/40 border border-zinc-800 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-32 bg-zinc-800 rounded" />
              <div className="h-5 w-16 bg-zinc-800 rounded" />
            </div>
            <div className="h-5 w-3/4 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
