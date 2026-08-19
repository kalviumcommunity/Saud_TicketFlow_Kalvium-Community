"use client";

import React, { useState } from "react";
import { INITIAL_MOCK_TICKETS } from "@/lib/mockData";
import { SingleTicketView } from "./SingleTicketView";

interface MyTicketsViewProps {
  initialSelectedTicketId?: string | null;
  onClearSelectedTicket?: () => void;
}

export function MyTicketsView({
  initialSelectedTicketId = null,
  onClearSelectedTicket,
}: MyTicketsViewProps) {
  const [tickets] = useState(INITIAL_MOCK_TICKETS);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(initialSelectedTicketId);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSelectTicket = (id: string) => {
    setSelectedTicketId(id);
  };

  const handleBackToList = () => {
    setSelectedTicketId(null);
    if (onClearSelectedTicket) {
      onClearSelectedTicket();
    }
  };

  // If a ticket is currently selected, render the SingleTicketView!
  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);
  if (selectedTicket) {
    return <SingleTicketView ticket={selectedTicket} onBack={handleBackToList} />;
  }

  // Otherwise, filter & render the Ticket List UI
  const filteredTickets = tickets.filter((ticket) => {
    const matchesStatus =
      filterStatus === "ALL"
        ? true
        : filterStatus === "URGENT"
        ? ticket.priority === "URGENT"
        : ticket.status === filterStatus;

    const matchesSearch =
      searchQuery.trim() === "" ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.customerCompany && ticket.customerCompany.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (ticket.customerName && ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">My Assigned Tickets</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Active support requests assigned to your queue (Lane 1 UI State)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
            {tickets.length} Tickets Active
          </span>
        </div>
      </div>

      {/* Controls: Search & Filter Chips */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Quick Search inside list */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter list by ID, title, or customer..."
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter status tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All Tickets" },
            { id: "OPEN", label: "Open" },
            { id: "IN_PROGRESS", label: "In Progress" },
            { id: "URGENT", label: "Urgent Priority" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                filterStatus === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket Cards List */}
      <div className="space-y-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleSelectTicket(ticket.id)}
              className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-indigo-500/50 hover:bg-zinc-900/90 transition-all cursor-pointer shadow-sm hover:shadow-lg"
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
                    <span>Updated {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center">
            <p className="text-sm text-zinc-400">No tickets found matching current filters.</p>
            <button
              type="button"
              onClick={() => {
                setFilterStatus("ALL");
                setSearchQuery("");
              }}
              className="mt-3 text-xs text-indigo-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
