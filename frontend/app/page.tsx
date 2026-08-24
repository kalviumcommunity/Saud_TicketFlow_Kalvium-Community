import React from "react";
import Link from "next/link";
import { getTickets } from "@/lib/api/tickets";
import { DashboardClient } from "@/components/DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — FreshAgent Hub",
  description: "High-performance customer support agent workspace overview.",
};

export default async function DashboardPage() {
  const { tickets, pagination } = await getTickets({ limit: 5 });

  const openTicketsCount = pagination.total || tickets.length;
  const urgentTicketsCount = tickets.filter((t) => t.priority === "URGENT").length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Support Agent Workspace
            </span>
            <span className="text-xs text-zinc-500">•</span>
            <span className="text-xs text-zinc-400 font-mono">App Router Active</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Welcome back, Agent
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            You have <span className="text-zinc-200 font-medium">{openTicketsCount} active tickets</span> requiring response.
          </p>
        </div>

        <DashboardClient />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Open Queue",
            value: openTicketsCount.toString(),
            change: "+1 today",
            changeType: "positive",
            icon: (
              <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
              </svg>
            ),
          },
          {
            label: "Urgent Priority",
            value: urgentTicketsCount.toString(),
            change: urgentTicketsCount > 0 ? "Action needed" : "Queue clear",
            changeType: urgentTicketsCount > 0 ? "warning" : "positive",
            icon: (
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            ),
          },
          {
            label: "Resolved Today",
            value: "8",
            change: "92% SLA met",
            changeType: "positive",
            icon: (
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
          {
            label: "Avg First Response",
            value: "11m",
            change: "2m faster than target",
            changeType: "positive",
            icon: (
              <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-sm hover:border-zinc-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-400">{stat.label}</span>
              <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50">
                {stat.icon}
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
              <span
                className={`text-xs font-medium ${
                  stat.changeType === "positive"
                    ? "text-emerald-400"
                    : "text-amber-400 font-semibold animate-pulse"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Ticket Queue Preview & Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ticket Workload Queue */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Assigned Queue</h2>
              <p className="text-xs text-zinc-400">Items requiring immediate attention</p>
            </div>
            <Link
              href="/tickets"
              className="text-xs px-3 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-medium border border-indigo-500/30 transition-colors"
            >
              View All ({openTicketsCount})
            </Link>
          </div>

          <div className="mt-4 divide-y divide-zinc-800/60">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-800/30 px-2 rounded-lg transition-colors group cursor-pointer block"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-indigo-400 font-medium">{ticket.id}</span>
                    <h3 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                      {ticket.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span>{ticket.customerCompany || ticket.customerName}</span>
                    <span>•</span>
                    <span>Updated {new Date(ticket.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-mono font-medium ${
                      ticket.priority === "URGENT"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : ticket.priority === "HIGH"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                      ticket.status === "OPEN"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right 1 Col: System Architecture */}
        <div className="space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Agent System Info</h3>
            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex justify-between py-1 border-b border-zinc-800/50">
                <span>Frontend Layer</span>
                <span className="text-emerald-400 font-medium">Next.js App Router</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/50">
                <span>Data Fetching</span>
                <span className="text-indigo-400 font-medium">Server Components</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/50">
                <span>Mutations</span>
                <span className="text-amber-400 font-medium">Server Actions</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Optimistic UI</span>
                <span className="text-emerald-400 font-medium">Active (useOptimistic)</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Shift Notes</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ticket triage operating under standard SLA response rates. Backend API layer configured with local fallback store for seamless offline usage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
