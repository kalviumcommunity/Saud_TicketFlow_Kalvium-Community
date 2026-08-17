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
}

export interface Reply {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: string;
  isOptimistic?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
