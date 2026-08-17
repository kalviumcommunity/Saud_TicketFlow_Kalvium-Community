# FreshAgent Hub — API Contract (Planned)

> [!IMPORTANT]
> **Planned Contract Notice**: This document defines the planned interface contract between the Next.js frontend and the Express REST API. The API endpoints described below are planned specifications for MVP implementation and are **not yet implemented**.

---

## 1. Architectural Boundary Overview

The frontend (Next.js) interacts with the backend (Express) exclusively via a RESTful HTTP/HTTPS API.

- **Protocol**: HTTP / HTTPS
- **Data Format**: JSON (`Content-Type: application/json`)
- **Authentication Header**: `Authorization: Bearer <jwt_token>`

```text
┌─────────────────┐       HTTP / REST (JSON)       ┌─────────────────┐
│ Next.js Client  │ ────────────────────────────> │   Express API   │
│  (Frontend)     │ <──────────────────────────── │    (Backend)    │
└─────────────────┘   Header: Bearer <jwt_token>   └─────────────────┘
```

---

## 2. Authentication & Authorization Expectations

### Authentication
- All protected API routes expect a valid JSON Web Token (JWT) transmitted in the HTTP headers:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- Unauthenticated requests to protected resources will receive an HTTP `401 Unauthorized` status response.

### Authorization (RBAC)
- Role-based authorization is enforced by Express middleware on the backend:
  - `isAgent`: Verifies that the authenticated user possesses `AGENT` or `ADMIN` privileges.
  - `isAdmin`: Verifies that the authenticated user possesses `ADMIN` privileges.
- Requests failing role verification will receive an HTTP `403 Forbidden` status response.

---

## 3. Major Planned API Resource Areas

Below are the high-level API resource areas planned for MVP development:

### 3.1 Health Resource Area (`/api/health`)

| Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Public | Returns service operational status and database connectivity status. |

---

### 3.2 Authentication Resource Area (`/api/auth`)

| Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Public | Accepts credentials (email/password), verifies user, and returns JWT token with user role metadata. |
| `/api/auth/me` | `GET` | Authenticated | Returns current authenticated user profile, identity, and role assignment. |

---

### 3.3 Ticket Management Resource Area (`/api/tickets`)

| Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/tickets` | `GET` | `isAgent` / `isAdmin` | Retrieves a paginated list of support tickets with basic metadata (status, priority, agent assignment). |
| `/api/tickets/:id` | `GET` | `isAgent` / `isAdmin` | Retrieves full details for a single ticket for rendering in the single-ticket paginated view. |
| `/api/tickets/:id` | `PATCH` | `isAgent` / `isAdmin` | Updates ticket metadata such as status (e.g., OPEN, IN_PROGRESS, RESOLVED, CLOSED) or tags. |

---

### 3.4 Ticket Reply Resource Area (`/api/tickets/:id/replies`)

| Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- |
| `/api/tickets/:id/replies` | `GET` | `isAgent` / `isAdmin` | Retrieves reply thread history associated with a specific ticket ID. |
| `/api/tickets/:id/replies` | `POST` | `isAgent` / `isAdmin` | Submits a new reply to a ticket. Target endpoint for client-side optimistic UI updates and retry operations. |

---

## 4. HTTP Status Code Semantics

The API adheres to standard HTTP status code conventions across all resource areas:

| Code | Status | Meaning & API Semantic |
| :--- | :--- | :--- |
| `200` | **OK** | Request successfully processed and result body returned. |
| `201` | **Created** | Resource successfully created (e.g., ticket reply successfully submitted). |
| `400` | **Bad Request** | Invalid payload structure, missing required parameters, or validation failure. |
| `401` | **Unauthorized** | Missing, malformed, or expired JWT authentication token. |
| `403` | **Forbidden** | User authenticated successfully but lacks required RBAC role permissions (`isAgent` or `isAdmin`). |
| `404` | **Not Found** | Target ticket, reply, or API endpoint resource does not exist. |
| `500` | **Internal Server Error** | Unexpected backend failure or database connection error. |

---

## 5. Contract Stability Notice

> [!NOTE]
> Detailed JSON schema definitions (field names, data types, pagination query parameters) will be established as feature development begins across Lane 1 (Saud), Lane 2 (Deepak), and Lane 3 (Supreeth). Any updates to this contract must be submitted via PR and approved by the team.
