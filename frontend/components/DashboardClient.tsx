"use client";

import React, { useState } from "react";
import { CreateTicketModal } from "./CreateTicketModal";

export function DashboardClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Ticket</span>
        </button>
      </div>

      <CreateTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
