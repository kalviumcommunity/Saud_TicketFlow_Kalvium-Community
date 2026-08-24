import React from "react";

export default function RootLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-32 rounded-2xl bg-zinc-900/60 border border-zinc-800" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-zinc-900/60 border border-zinc-800" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-zinc-900/40 border border-zinc-800" />
    </div>
  );
}
