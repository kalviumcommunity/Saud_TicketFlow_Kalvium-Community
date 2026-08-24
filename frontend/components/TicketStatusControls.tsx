"use client";

import React, { useState, useTransition } from "react";
import { Ticket } from "@/types";
import { updateTicketStatusAction, updateTicketPriorityAction } from "@/app/actions/ticketActions";

interface TicketStatusControlsProps {
  ticket: Ticket;
}

export function TicketStatusControls({ ticket }: TicketStatusControlsProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<Ticket["status"]>(ticket.status);
  const [priority, setPriority] = useState<Ticket["priority"]>(ticket.priority);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleStatusChange = (newStatus: Ticket["status"]) => {
    setStatus(newStatus);
    setFeedbackMsg("Updating status...");
    startTransition(async () => {
      const result = await updateTicketStatusAction(ticket.id, newStatus);
      if (result.success) {
        setFeedbackMsg(`Status changed to ${newStatus}`);
      } else {
        setFeedbackMsg(`Error: ${result.error}`);
        setStatus(ticket.status);
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  const handlePriorityChange = (newPriority: Ticket["priority"]) => {
    setPriority(newPriority);
    setFeedbackMsg("Updating priority...");
    startTransition(async () => {
      const result = await updateTicketPriorityAction(ticket.id, newPriority);
      if (result.success) {
        setFeedbackMsg(`Priority changed to ${newPriority}`);
      } else {
        setFeedbackMsg(`Error: ${result.error}`);
        setPriority(ticket.priority);
      }
      setTimeout(() => setFeedbackMsg(null), 3000);
    });
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ticket Management</h3>
        {isPending && <span className="text-[10px] text-indigo-400 animate-pulse font-mono">Saving...</span>}
      </div>

      {feedbackMsg && (
        <div className="text-[11px] p-2 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono">
          {feedbackMsg}
        </div>
      )}

      <div className="space-y-3 text-xs">
        <div>
          <label className="text-zinc-500 block mb-1 font-medium">Status</label>
          <select
            value={status}
            disabled={isPending}
            onChange={(e) => handleStatusChange(e.target.value as Ticket["status"])}
            className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-medium focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <div>
          <label className="text-zinc-500 block mb-1 font-medium">Priority</label>
          <select
            value={priority}
            disabled={isPending}
            onChange={(e) => handlePriorityChange(e.target.value as Ticket["priority"])}
            className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 font-mono font-medium focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>
      </div>
    </div>
  );
}
