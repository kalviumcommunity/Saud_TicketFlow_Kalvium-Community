/**
 * FreshAgent Hub - Type Definitions Placeholder
 * Sensible location for UI state and API payload types.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'AGENT' | 'ADMIN';
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  agentId?: string;
  agentName?: string;
  agent?: { id: string; name: string; email: string } | null;
  customerName?: string;
  customerEmail?: string;
  customerCompany?: string;
  tags?: string[];
  repliesCount?: number;
  replies?: Reply[];
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface Reply {
  id: string;
  ticketId: string;
  userId: string;
  userName?: string;
  userRole?: 'AGENT' | 'ADMIN' | 'CUSTOMER';
  content: string;
  createdAt: string;
  isOptimistic?: boolean;
  isInternal?: boolean;
  attachments?: Attachment[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  pagination?: Pagination;
  error?: string;
}

