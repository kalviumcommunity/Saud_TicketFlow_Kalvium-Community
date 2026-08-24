import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — FreshAgent Hub",
  description: "Configure support desk agent preferences and environment options.",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight">Support Desk Settings</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure agent workspace preferences and layout options
        </p>
      </div>

      <div className="space-y-4">
        {/* Profile Preferences */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white">Agent Preferences</h2>

          <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
            <div>
              <p className="text-xs font-medium text-zinc-200">Desktop Notifications</p>
              <p className="text-[11px] text-zinc-400">Receive alerts when new urgent tickets are assigned</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-indigo-600 p-0.5 flex items-center justify-end">
              <div className="h-5 w-5 rounded-full bg-white shadow-md"></div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
            <div>
              <p className="text-xs font-medium text-zinc-200">Compact Density View</p>
              <p className="text-[11px] text-zinc-400">Show high density rows in ticket list views</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-zinc-800 p-0.5 flex items-center justify-start">
              <div className="h-5 w-5 rounded-full bg-zinc-400 shadow-md"></div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-medium text-zinc-200">Auto-refresh Ticket Feed</p>
              <p className="text-[11px] text-zinc-400">Periodically revalidate ticket state updates</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-indigo-600 p-0.5 flex items-center justify-end">
              <div className="h-5 w-5 rounded-full bg-white shadow-md"></div>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2 text-xs">
          <h2 className="text-sm font-semibold text-white mb-2">Workspace Environment</h2>
          <div className="flex justify-between py-1 text-zinc-400">
            <span>Branch</span>
            <span className="font-mono text-indigo-400">feature/final-frontend</span>
          </div>
          <div className="flex justify-between py-1 text-zinc-400">
            <span>Next.js Architecture</span>
            <span className="font-medium text-zinc-200">App Router &bull; Module 2</span>
          </div>
          <div className="flex justify-between py-1 text-zinc-400">
            <span>Status</span>
            <span className="text-emerald-400 font-semibold">Active Production Build</span>
          </div>
        </div>
      </div>
    </div>
  );
}
