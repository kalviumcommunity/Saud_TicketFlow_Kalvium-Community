"use client";

import React, { useState } from "react";
import { Ticket } from "@/types";

interface SingleTicketViewProps {
  ticket: Ticket;
  onBack: () => void;
}

export function SingleTicketView({ ticket, onBack }: SingleTicketViewProps) {
  const [replyMode, setReplyMode] = useState<"public" | "internal">("public");
  const [replyText, setReplyText] = useState("");

  const getPriorityStyle = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "URGENT":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "HIGH":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "MEDIUM":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "LOW":
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  const getStatusStyle = (status: Ticket["status"]) => {
    switch (status) {
      case "OPEN":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "IN_PROGRESS":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "RESOLVED":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "CLOSED":
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to My Tickets</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">Lane 1 UI View</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-sm text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-0.5 rounded border border-indigo-500/20">
                {ticket.id}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-semibold border ${getPriorityStyle(ticket.priority)}`}>
                {ticket.priority}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-medium border ${getStatusStyle(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              {ticket.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Thread (2 cols) vs Sidebar (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Original Issue + Replies + Reply Input Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Issue Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-sm">
                  {ticket.customerName ? ticket.customerName.split(" ").map(n => n[0]).join("") : "C"}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{ticket.customerName || "Customer"}</h3>
                  <p className="text-xs text-zinc-400">{ticket.customerEmail || "customer@example.com"}</p>
                </div>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                Created: {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="text-sm text-zinc-200 leading-relaxed font-sans whitespace-pre-line bg-zinc-950/40 p-4 rounded-lg border border-zinc-800/50">
              {ticket.description}
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider text-xs">
                Conversation History ({ticket.replies?.length || 0})
              </h2>
            </div>

            <div className="space-y-4">
              {ticket.replies && ticket.replies.length > 0 ? (
                ticket.replies.map((reply) => {
                  const isAgent = reply.userRole === "AGENT";
                  return (
                    <div
                      key={reply.id}
                      className={`rounded-xl border p-5 transition-all ${
                        isAgent
                          ? "border-indigo-500/30 bg-indigo-950/20 ml-2 sm:ml-6"
                          : "border-zinc-800 bg-zinc-900/40 mr-2 sm:mr-6"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              isAgent
                                ? "bg-indigo-600 text-white"
                                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                            }`}
                          >
                            {reply.userName ? reply.userName.split(" ").map((n) => n[0]).join("") : "U"}
                          </div>
                          <span className="text-xs font-semibold text-zinc-200">{reply.userName}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                              isAgent
                                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                            }`}
                          >
                            {reply.userRole}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pl-9">
                        {reply.content}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 text-center text-xs text-zinc-500">
                  No replies posted yet.
                </div>
              )}
            </div>
          </div>

          {/* Reply / Message Area UI Placeholder */}
          <div className="rounded-xl border border-indigo-500/30 bg-zinc-900/70 p-5 space-y-4 shadow-xl">
            {/* Header / Mode Selector */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReplyMode("public")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    replyMode === "public"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                  }`}
                >
                  Public Customer Reply
                </button>
                <button
                  type="button"
                  onClick={() => setReplyMode("internal")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    replyMode === "internal"
                      ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                  }`}
                >
                  Internal Agent Note
                </button>
              </div>

              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                UI Foundation Mode
              </span>
            </div>

            {/* Rich Editor Bar (UI Controls Placeholder) */}
            <div className="flex items-center gap-2 text-zinc-400 text-xs px-2 py-1 bg-zinc-950/60 rounded-lg border border-zinc-800">
              <button type="button" className="p-1 hover:text-white rounded" title="Bold">
                <strong>B</strong>
              </button>
              <button type="button" className="p-1 hover:text-white rounded italic" title="Italic">
                <em>I</em>
              </button>
              <button type="button" className="p-1 hover:text-white rounded font-mono" title="Code">
                &lt;/&gt;
              </button>
              <div className="h-3 w-px bg-zinc-800 my-auto" />
              <button type="button" className="p-1 hover:text-white rounded" title="Attach file">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <span className="ml-auto text-[10px] text-zinc-500">Markdown supported</span>
            </div>

            {/* Textarea */}
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={
                replyMode === "public"
                  ? "Type your response to the customer here..."
                  : "Type an internal note visible only to support agents..."
              }
              className="w-full p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-sans resize-y"
            />

            {/* Footer Action Bar & Placeholder Warning */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20 font-medium">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  [UI Placeholder - Submission disabled in Lane 1]
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 rounded-xl bg-indigo-600/40 text-indigo-200 text-xs font-semibold cursor-not-allowed border border-indigo-500/30 flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Submit Reply</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Metadata Sidebar */}
        <div className="space-y-5">
          {/* Customer Profile Box */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Customer Details</h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-zinc-500 block">Name</span>
                <span className="text-zinc-200 font-semibold">{ticket.customerName || "N/A"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Email</span>
                <span className="text-indigo-400 font-mono">{ticket.customerEmail || "N/A"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Organization</span>
                <span className="text-zinc-300 font-medium">{ticket.customerCompany || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Ticket Metadata Controls */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ticket Metadata</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-500 block mb-1">Assigned Agent</label>
                <div className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-medium flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{ticket.agentName || "Unassigned"}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">AGENT</span>
                </div>
              </div>

              <div>
                <label className="text-zinc-500 block mb-1">Priority</label>
                <div className={`p-2.5 rounded-lg font-mono font-semibold border ${getPriorityStyle(ticket.priority)}`}>
                  {ticket.priority}
                </div>
              </div>

              <div>
                <label className="text-zinc-500 block mb-1">Status</label>
                <div className={`p-2.5 rounded-lg font-medium border ${getStatusStyle(ticket.status)}`}>
                  {ticket.status}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-3">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tags</h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              {ticket.tags && ticket.tags.length > 0 ? (
                ticket.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-zinc-800/80 text-zinc-300 text-[11px] font-mono border border-zinc-700/60"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-500">No tags assigned</span>
              )}
            </div>
          </div>

          {/* SLA Info Box */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-zinc-400 font-medium">SLA Countdown</span>
              <span className="text-emerald-400 font-mono font-bold">1h 45m</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mt-2">
              <div className="bg-emerald-500 h-1.5 rounded-full w-[70%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
