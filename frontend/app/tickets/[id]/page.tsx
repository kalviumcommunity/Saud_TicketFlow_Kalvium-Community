import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTicketById } from "@/lib/api/tickets";
import { TicketReplyForm } from "@/components/TicketReplyForm";
import { TicketStatusControls } from "@/components/TicketStatusControls";

interface TicketDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: TicketDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    return {
      title: "Ticket Not Found — FreshAgent Hub",
    };
  }

  return {
    title: `[${ticket.id}] ${ticket.title} — FreshAgent Hub`,
    description: ticket.description.slice(0, 150),
  };
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const { id } = await params;
  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "HIGH":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "MEDIUM":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "IN_PROGRESS":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "RESOLVED":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center justify-between">
          <Link
            href="/tickets"
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to My Tickets</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-mono">
              Server Action & Optimistic UI Ready
            </span>
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

      {/* Main Grid: Details + Thread vs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Original Issue + Thread & Reply Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Issue Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-4 shadow-sm">
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

          {/* Reply Form & Thread Component */}
          <TicketReplyForm ticket={ticket} />
        </div>

        {/* Right Column: Ticket Metadata Sidebar */}
        <div className="space-y-5">
          {/* Status & Priority Interactive Controls */}
          <TicketStatusControls ticket={ticket} />

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
