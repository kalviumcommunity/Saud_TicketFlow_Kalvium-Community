import React from "react";

export function MyTicketsView() {
  const myTickets = [
    {
      id: "TCK-1042",
      title: "API rate limits exceeded on production webhooks",
      customer: "Acme Corp",
      priority: "URGENT",
      status: "OPEN",
      created: "10 mins ago",
      responses: 2,
    },
    {
      id: "TCK-1041",
      title: "SSO SAML login redirection failure",
      customer: "Starlight Media",
      priority: "HIGH",
      status: "IN_PROGRESS",
      created: "45 mins ago",
      responses: 5,
    },
    {
      id: "TCK-1039",
      title: "Dashboard analytics metrics out of sync",
      customer: "Nexus Labs",
      priority: "MEDIUM",
      status: "OPEN",
      created: "2 hours ago",
      responses: 1,
    },
    {
      id: "TCK-1035",
      title: "Request for billing address update on invoice",
      customer: "Cloud Scale Inc",
      priority: "LOW",
      status: "OPEN",
      created: "4 hours ago",
      responses: 3,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">My Assigned Tickets</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Active support requests assigned to your queue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
            4 Tickets Active
          </span>
        </div>
      </div>

      {/* Ticket Cards List */}
      <div className="space-y-3">
        {myTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 hover:border-zinc-700 transition-all hover:shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-indigo-400 font-semibold">{ticket.id}</span>
                  <span className="text-xs text-zinc-500">•</span>
                  <span className="text-xs font-medium text-zinc-300">{ticket.customer}</span>
                </div>
                <h2 className="text-base font-semibold text-white">{ticket.title}</h2>
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span>Created {ticket.created}</span>
                  <span>•</span>
                  <span>{ticket.responses} replies</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-1 rounded font-mono font-medium ${
                    ticket.priority === "URGENT"
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      : ticket.priority === "HIGH"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                  }`}
                >
                  {ticket.priority}
                </span>
                <span className="text-xs px-2.5 py-1 rounded font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {ticket.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
