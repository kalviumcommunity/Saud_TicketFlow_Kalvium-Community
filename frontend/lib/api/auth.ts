import { api } from './client';
import { User } from '@/types';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const TOKEN_KEY = 'freshagent_token';
const USER_KEY = 'freshagent_user';

/**
 * Authenticate user credentials against backend REST API.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', credentials);
  
  if (response.success && response.data) {
    const { token, user } = response.data;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    return response.data;
  }
  
  throw new Error('Authentication failed');
}

/**
 * Fetch current authenticated user profile from backend.
 */
export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  
  try {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    if (response.success && response.data) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      return response.data;
    }
  } catch (error) {
    console.warn('Failed to verify user session token:', error);
    logout();
  }
  
  return null;
}

/**
 * Retrieve cached user from localStorage.
 */
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Retrieve active JWT token from localStorage.
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Clear stored auth credentials and log out user.
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
