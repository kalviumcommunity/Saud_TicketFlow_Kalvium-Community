import { Ticket, Reply, Pagination, Attachment } from "@/types";
import { INITIAL_MOCK_TICKETS } from "@/lib/mockData";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// In-memory fallback data store initialized with mock tickets
let fallbackTicketsStore: Ticket[] = JSON.parse(JSON.stringify(INITIAL_MOCK_TICKETS));

export interface GetTicketsParams {
  status?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Helper to construct authorization headers if a token is present
 */
function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("freshagent_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

/**
 * Fetch list of tickets from backend with query parameters and fallback to mock store.
 */
export async function getTickets(params: GetTicketsParams = {}): Promise<{
  tickets: Ticket[];
  pagination: Pagination;
}> {
  const { status, priority, search, page = 1, limit = 10 } = params;

  try {
    const query = new URLSearchParams();
    if (status && status !== "ALL") query.append("status", status);
    if (priority && priority !== "ALL") query.append("priority", priority);
    if (search) query.append("search", search);
    query.append("page", page.toString());
    query.append("limit", limit.toString());

    const response = await fetch(`${API_BASE_URL}/tickets?${query.toString()}`, {
      headers: getHeaders(),
      cache: "no-store",
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        return {
          tickets: result.data,
          pagination: result.pagination || {
            total: result.data.length,
            page,
            limit,
            totalPages: Math.ceil(result.data.length / limit) || 1,
          },
        };
      }
    }
  } catch (error) {
    console.warn("Backend API unavailable, using fallback mock store:", error);
  }

  // Fallback filtering & pagination logic
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
        (t.customerName && t.customerName.toLowerCase().includes(q)) ||
        (t.customerCompany && t.customerCompany.toLowerCase().includes(q))
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
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      headers: getHeaders(),
      cache: "no-store",
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (error) {
    console.warn(`Backend API failed for getTicketById(${id}), using fallback store`, error);
  }

  // Fallback search
  const found = fallbackTicketsStore.find((t) => t.id === id);
  return found ? JSON.parse(JSON.stringify(found)) : null;
}

/**
 * Update ticket properties (status, priority, tags, etc.)
 */
export async function updateTicket(
  id: string,
  updates: Partial<Ticket>
): Promise<Ticket> {
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (error) {
    console.warn(`Backend API failed for updateTicket(${id}), using fallback store`, error);
  }

  // Fallback update
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
  try {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/replies`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ content, message: content, isInternal }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        const replyWithAttachments = {
          ...result.data,
          attachments,
        };
        return replyWithAttachments;
      }
    }
  } catch (error) {
    console.warn(`Backend API failed for createReply(${ticketId}), using fallback store`, error);
  }

  // Fallback store reply creation
  const newReply: Reply = {
    id: `rpl-${Date.now().toString().slice(-4)}`,
    ticketId,
    userId: "usr-agent-01",
    userName: "Agent Alex",
    userRole: isInternal ? "AGENT" : "AGENT",
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
  const newId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newTicket: Ticket = {
    id: newId,
    ...ticketData,
    createdAt: now,
    updatedAt: now,
    repliesCount: 0,
    replies: [],
  };

  try {
    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(newTicket),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (error) {
    console.warn("Backend API failed for createTicket, using fallback store", error);
  }

  fallbackTicketsStore.unshift(newTicket);
  return newTicket;
}
