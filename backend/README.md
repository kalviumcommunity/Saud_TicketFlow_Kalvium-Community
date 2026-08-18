# FreshAgent Hub — Backend REST API & Authentication

High-performance Express REST API for **FreshAgent Hub**, supporting stateless JWT authentication, Role-Based Access Control (RBAC), ticket management with strict agent isolation boundaries, optimistic UI reply submission integration, and Prisma ORM persistence.

---

## 1. Quick Start & Installation

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma Client & Sync Database Schema
npm run prisma:generate
npm run prisma:push

# Run Development Server
npm run dev

# Run Automated Test Suite
npm test

# Build Production Dist
npm run build
```

---

## 2. Environment Variables (`.env`)

Copy `.env.example` to `.env` and fill in the configuration values:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="freshagent_hub_super_secret_jwt_key_2026"
JWT_EXPIRES_IN="1d"
```

*Note: Never commit `.env` to Git.*

---

## 3. API Architecture & Security Boundaries

### Authentication
- Stateless JSON Web Tokens (JWT).
- All protected endpoints require header:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- Unauthenticated requests receive HTTP `401 Unauthorized`.

### Authorization (RBAC)
- **`isAgent`**: Allows users with role `AGENT` or `ADMIN`.
- **`isAdmin`**: Allows users with role `ADMIN`.
- Fails with HTTP `403 Forbidden` for unauthorized roles.

### Ticket Ownership Security
- **Agents**: Can ONLY view, query, update, or reply to tickets assigned to their user ID (`agentId === req.user.id`). Attempting to access another agent's ticket returns HTTP `404 Not Found` (to avoid resource enumeration) or `403 Forbidden`.
- **Admins**: Can access, update, and reassign tickets system-wide.

---

## 4. Endpoints Overview

| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System health & database connectivity status |
| `POST` | `/api/auth/login` | Public | Authenticates credentials and returns JWT token |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated user profile |
| `GET` | `/api/tickets` | `isAgent` / `isAdmin` | Paginated ticket list (`?page=1&limit=10`). Filtered by agent assignment for `AGENT` |
| `GET` | `/api/tickets/:id` | `isAgent` / `isAdmin` | Ticket detail view. Agent ownership enforced |
| `PATCH` | `/api/tickets/:id` | `isAgent` / `isAdmin` | Updates ticket status/priority/tags. Reassignment reserved for `ADMIN` |
| `GET` | `/api/tickets/:id/replies` | `isAgent` / `isAdmin` | Fetches reply history for authorized ticket |
| `POST` | `/api/tickets/:id/replies` | `isAgent` / `isAdmin` | Submits reply (HTTP 201 Created). Supports optimistic UI updates |

---

## 5. API Response & Error Structures

### Standard Success Response
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Customer Unable to Login",
    "status": "OPEN",
    "priority": "HIGH",
    "agentId": "agent-id-uuid",
    "tags": ["auth", "login"],
    "createdAt": "2026-08-17T10:00:00.000Z",
    "updatedAt": "2026-08-17T10:00:00.000Z"
  }
}
```

### Paginated List Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication token missing or invalid"
  },
  "message": "Authentication token missing or invalid"
}
```

---

## 6. Database & Teammate Integration Notice (Lane 3 — Supreeth)

- The backend schema is defined in `backend/prisma/schema.prisma`.
- Entities provided: `User` (id, email, name, password, role), `Ticket` (id, title, description, status, priority, agentId, tags), `Reply` (id, ticketId, userId, content, createdAt).
- If Lane 3 adds background messaging queue models (e.g. Redis/BullMQ/Kafka) or migration scripts for production PostgreSQL, the service layer in `src/services/ticket.service.ts` is decoupled to consume them seamlessly.
