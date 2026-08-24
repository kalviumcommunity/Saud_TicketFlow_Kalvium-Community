"use client";

import React, { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Pagination } from "@/types";

interface PaginationControlsProps {
  pagination: Pagination;
}

export function PaginationControls({ pagination }: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { page, totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
      <div>
        Showing <span className="text-zinc-200 font-medium">{startItem}</span> to{" "}
        <span className="text-zinc-200 font-medium">{endItem}</span> of{" "}
        <span className="text-zinc-200 font-medium">{total}</span> tickets
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1 || isPending}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => goToPage(p)}
            disabled={isPending}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
              p === page
                ? "bg-indigo-600 text-white font-bold"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages || isPending}
          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
