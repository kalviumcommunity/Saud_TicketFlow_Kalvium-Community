"use client";

import React, { useState, useTransition } from "react";
import { createTicketAction } from "@/app/actions/ticketActions";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createTicketAction(formData);
      if (result.success) {
        onClose();
      } else {
        setErrorMsg(result.error || "Failed to create ticket.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-lg font-bold text-white tracking-tight">Create Support Ticket</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            &times;
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Issue Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Webhook rate limit spike on production"
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Customer Name</label>
              <input
                type="text"
                name="customerName"
                placeholder="Sarah Connor"
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Customer Email</label>
              <input
                type="email"
                name="customerEmail"
                placeholder="s.connor@acmecorp.com"
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Organization / Company</label>
              <input
                type="text"
                name="customerCompany"
                placeholder="Acme Corp"
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-medium">Priority</label>
              <select
                name="priority"
                defaultValue="MEDIUM"
                className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1 font-medium">Description *</label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Detailed description of the issue..."
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
