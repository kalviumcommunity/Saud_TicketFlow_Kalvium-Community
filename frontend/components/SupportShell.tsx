"use client";

import React, { useState } from "react";
import { Header, NavItem } from "./Header";
import { Sidebar } from "./Sidebar";
import { DashboardView } from "./views/DashboardView";
import { MyTicketsView } from "./views/MyTicketsView";
import { ClosedTicketsView } from "./views/ClosedTicketsView";
import { SearchView } from "./views/SearchView";
import { SettingsView } from "./views/SettingsView";

export function SupportShell() {
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const handleOpenTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setActiveNav("my-tickets");
  };

  const renderMainContent = () => {
    switch (activeNav) {
      case "dashboard":
        return <DashboardView onSelectTicket={handleOpenTicket} />;
      case "my-tickets":
        return (
          <MyTicketsView
            initialSelectedTicketId={selectedTicketId}
            onClearSelectedTicket={() => setSelectedTicketId(null)}
          />
        );
      case "closed-tickets":
        return <ClosedTicketsView />;
      case "search":
        return <SearchView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView onSelectTicket={handleOpenTicket} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans antialiased">
      {/* Top Header Navigation */}
      <Header
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Body Frame: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={setActiveNav}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-zinc-950">
          <div className="mx-auto max-w-7xl">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-4 px-6 text-center text-xs text-zinc-500">
        FreshAgent Hub &bull; Lane 1 Support Desk Foundation &bull; Day 2 Shell
      </footer>
    </div>
  );
}
