import { Ticket, Reply, Pagination, Attachment } from "@/types";
import { INITIAL_MOCK_TICKETS } from "@/lib/mockData";
import { api } from "./client";

// In-memory fallback data store for explicit offline/demo mode only
let fallbackTicketsStore: Ticket[] = JSON.parse(JSON.stringify(INITIAL_MOCK_TICKETS));

const USE_DEMO_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export interface GetTicketsParams {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Format raw backend ticket response DTO into frontend Ticket interface.
 */
function mapBackendTicket(t: any): Ticket {
  const replies = Array.isArray(t.replies)
    ? t.replies.map((r: any) => ({
        id: r.id,
        ticketId: r.ticketId,
        userId: r.userId,
        userName: r.user?.name || "Support User",
        userRole: r.user?.role || "AGENT",
        content: r.content,
        createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date(r.createdAt).toISOString(),
        isInternal: r.isInternal || false,
      }))
    : [];

  return {
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    createdAt: typeof t.createdAt === "string" ? t.createdAt : new Date(t.createdAt).toISOString(),
    updatedAt: typeof t.updatedAt === "string" ? t.updatedAt : new Date(t.updatedAt).toISOString(),
    agentId: t.agentId || undefined,
    agentName: t.agent?.name || (t.agentId ? "Assigned Agent" : "Unassigned"),
    agent: t.agent || null,
    customerName: t.customerName || "Customer User",
    customerEmail: t.customerEmail || "customer@example.com",
    customerCompany: t.customerCompany || "Enterprise Client",
    tags: Array.isArray(t.tags) ? t.tags : typeof t.tags === "string" ? JSON.parse(t.tags || "[]") : [],
    repliesCount: replies.length,
    replies,
  };
}

/**
 * Fetch list of tickets from backend REST API.
 */
export async function getTickets(params: GetTicketsParams = {}): Promise<{
  tickets: Ticket[];
  pagination: Pagination;
}> {
  const { status, priority, search, page = 1, limit = 10 } = params;

  if (!USE_DEMO_MOCK) {
    try {
      const query = new URLSearchParams();
      if (status && status !== "ALL") query.append("status", status);
      if (priority && priority !== "ALL") query.append("priority", priority);
      if (search) query.append("search", search);
      query.append("page", page.toString());
      query.append("limit", limit.toString());

      const result = await api.get<{
        success: boolean;
        data: any[];
        pagination: Pagination;
      }>(`/tickets?${query.toString()}`);

      if (result.success && Array.isArray(result.data)) {
        return {
          tickets: result.data.map(mapBackendTicket),
          pagination: result.pagination || {
            total: result.data.length,
            page,
            limit,
            totalPages: Math.ceil(result.data.length / limit) || 1,
          },
        };
      }
    } catch (error) {
      if (typeof window !== "undefined") {
        throw error;
      }
      console.warn("Server build fetch failed, returning initial ticket payload:", error);
    }
  }

  // Fallback filtering & pagination logic for SSR build / demo mode
  let filtered = [...fallbackTicketsStore];

  if (status && status !== "ALL") {
    if (status === "URGENT") {
      filtered = filtered.filter((t) => t.priority === "URGENT");
    } else {
      filtered = filtered.filter((t) => t.status === status);
    }
  }

  if (priority && priority !== "ALL") {
    filtered = filtered.filter((t) => t.priority === priority);
  }

  if (search && search.trim() !== "") {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.customerName && t.customerName.toLowerCase().includes(q))
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedTickets = filtered.slice(startIndex, startIndex + limit);

  return {
    tickets: paginatedTickets,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

/**
 * Fetch a single ticket by ID.
 */
export async function getTicketById(id: string): Promise<Ticket | null> {
  if (!USE_DEMO_MOCK) {
    try {
      const result = await api.get<{ success: boolean; data: any }>(`/tickets/${id}`);
      if (result.success && result.data) {
        return mapBackendTicket(result.data);
      }
      return null;
    } catch (error) {
      if (typeof window !== "undefined") {
        throw error;
      }
    }
  }

  const found = fallbackTicketsStore.find((t) => t.id === id);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

/**
 * Update ticket properties (status, priority, tags, title, description, etc.)
 */
export async function updateTicket(
  id: string,
  updates: Partial<Ticket>
): Promise<Ticket> {
  if (!USE_DEMO_MOCK) {
    const payload: any = {};
    if (updates.status) payload.status = updates.status;
    if (updates.priority) payload.priority = updates.priority;
    if (updates.title) payload.title = updates.title;
    if (updates.description) payload.description = updates.description;
    if (updates.tags) payload.tags = updates.tags;
    if (updates.agentId) payload.agentId = updates.agentId;

    const result = await api.patch<{ success: boolean; data: any }>(`/tickets/${id}`, payload);
    if (result.success && result.data) {
      return mapBackendTicket(result.data);
    }
  }

  const index = fallbackTicketsStore.findIndex((t) => t.id === id);
  if (index !== -1) {
    fallbackTicketsStore[index] = {
      ...fallbackTicketsStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(fallbackTicketsStore[index]));
  }

  throw new Error(`Ticket ${id} not found`);
}

/**
 * Post a new reply to a ticket.
 */
export async function createReply(
  ticketId: string,
  content: string,
  attachments: Attachment[] = [],
  isInternal: boolean = false
): Promise<Reply> {
  if (!USE_DEMO_MOCK) {
    const result = await api.post<{ success: boolean; data: any }>(`/tickets/${ticketId}/replies`, {
      content,
      message: content,
      isInternal,
    });

    if (result.success && result.data) {
      const r = result.data;
      return {
        id: r.id,
        ticketId: r.ticketId,
        userId: r.userId,
        userName: r.user?.name || "Agent User",
        userRole: r.user?.role || "AGENT",
        content: r.content,
        createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date(r.createdAt).toISOString(),
        isInternal,
        attachments,
      };
    }
  }

  const newReply: Reply = {
    id: `rpl-${Date.now().toString().slice(-4)}`,
    ticketId,
    userId: "usr-agent-01",
    userName: "Agent Alex",
    userRole: "AGENT",
    content,
    createdAt: new Date().toISOString(),
    isInternal,
    attachments,
  };

  const ticket = fallbackTicketsStore.find((t) => t.id === ticketId);
  if (ticket) {
    ticket.replies = ticket.replies || [];
    ticket.replies.push(newReply);
    ticket.repliesCount = ticket.replies.length;
    ticket.updatedAt = new Date().toISOString();
  }

  return newReply;
}

/**
 * Create a new support ticket.
 */
export async function createTicket(
  ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "replies">
): Promise<Ticket> {
  if (!USE_DEMO_MOCK) {
    const payload = {
      title: ticketData.title,
      description: ticketData.description,
      status: ticketData.status || "OPEN",
      priority: ticketData.priority || "MEDIUM",
      tags: ticketData.tags || [],
    };

    const result = await api.post<{ success: boolean; data: any }>("/tickets", payload);
    if (result.success && result.data) {
      return mapBackendTicket(result.data);
    }
  }

  const newTicket: Ticket = {
    id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
    ...ticketData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    repliesCount: 0,
    replies: [],
  };

  fallbackTicketsStore.unshift(newTicket);
  return newTicket;
}
