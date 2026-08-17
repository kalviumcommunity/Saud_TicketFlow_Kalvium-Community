# FreshAgent Hub — System Architecture

This document details the system architecture, component responsibilities, data flow, authentication boundaries, and team ownership structure for **FreshAgent Hub — Performance-Optimized Support Interface**.

---

## 1. Overall System Architecture

FreshAgent Hub is structured as a decoupled multi-layer web application designed for high performance, role-based access control, and responsive customer support workflows.

```text
Browser
   │
   ▼
Next.js Frontend (Presentation Layer)
   │  [HTTP REST Requests / JSON Payload]
   ▼
Express REST API (API Gateway & Controller Layer)
   │  [Token Verification]
   ▼
JWT Authentication Middleware
   │  [Role Checking: isAgent / isAdmin]
   ▼
RBAC / Authorization Middleware
   │  [Domain Logic & Data Validation]
   ▼
Business Logic Layer
   │  [Type-Safe Queries]
   ▼
Prisma ORM (Data Access Layer)
   │  [SQL Statements]
   ▼
PostgreSQL Database (Persistence Layer)

Infrastructure Target: GCP-Compatible Deployment Infrastructure
```

---

## 2. Major Layer Responsibilities

| Layer | Technology | Primary Responsibilities |
| :--- | :--- | :--- |
| **Browser** | Client Device Container | Renders the web interface, captures user input, handles browser events, and manages local client state. |
| **Frontend** | Next.js, Tailwind CSS | Manages UI components, single-ticket paginated view, optimistic UI messaging hooks, client-side error handling, and retry UI. |
| **Backend API** | Node.js, Express REST API | Manages HTTP routes, payload validation, request orchestration, and error response formatting. |
| **Authentication** | JWT (JSON Web Tokens) | Validates incoming request headers (`Authorization: Bearer <token>`), verifies signature authenticity, and extracts payload context. |
| **Authorization** | RBAC Middleware | Enforces role-based permissions (`isAgent`, `isAdmin`) on protected API endpoints. |
| **Business Logic** | Node.js Services | Executes domain workflows, ticket state updates, reply submission validation, and business rule enforcement. |
| **Data Access** | Prisma ORM | Provides a type-safe interface for database queries, schema mapping, transactions, and migration execution. |
| **Persistence** | PostgreSQL | Relational database storing core entities including users, roles, tickets, replies, tags, and status history. |
| **Infrastructure** | GCP-Compatible Target | Cloud container/server environment hosting frontend and backend services. |

---

## 3. End-to-End Data Flow (Frontend → API → Database)

The primary operational flow follows a strict request-response lifecycle:

```text
[1. User Interaction]
       │  Agent views single ticket / types a reply in Next.js UI
       ▼
[2. Optimistic UI Update]
       │  Next.js immediately updates local UI state for fast feedback
       ▼
[3. HTTP REST Request]
       │  Next.js sends POST /api/tickets/:id/replies with Bearer JWT
       ▼
[4. Authentication]
       │  Express JWT middleware verifies token validity & extracts user identity
       ▼
[5. Authorization (RBAC)]
       │  RBAC middleware checks if user possesses required role (isAgent / isAdmin)
       ▼
[6. Business Logic]
       │  Validates reply content, processes state transitions
       ▼
[7. Prisma ORM Execution]
       │  Prisma maps data structures into parameterized SQL queries
       ▼
[8. PostgreSQL Persistence]
       │  PostgreSQL commits transaction to storage and returns result
       ▼
[9. Response & Reconciliation]
       │  Express sends 201 Created JSON response; Next.js reconciles UI state
```

In the event of network or backend failures during step 3–8, the frontend UI error handler catches the exception, updates UI state from optimistic to failed, and provides a retry mechanism to re-trigger the submission.

---

## 4. Authentication & Authorization Boundaries

### Authentication Boundary
- **Mechanism**: Stateless JWT (JSON Web Token) authentication.
- **Transmission**: Tokens are supplied by the frontend in the standard HTTP header:
  `Authorization: Bearer <jwt_token>`
- **Verification**: The backend verifies token signature, expiration (`exp`), and claims (`userId`, `role`) on every protected request.
- **Boundary Rule**: The frontend holds tokens in secure storage; authentication verification occurs strictly on the Express backend server.

### Authorization Boundary (RBAC)
- **Enforcement**: Role-Based Access Control is enforced **exclusively by backend middleware** (`isAgent`, `isAdmin`).
- **Client vs Server**: While the Next.js frontend uses user role metadata to conditionally render UI controls for optimal UX, frontend state is **never trusted** as a security boundary.
- **Endpoint Guarding**: Every restricted endpoint passes through authorization middleware before reaching business logic controllers.

---

## 5. Agent vs. Admin Role Responsibilities

```text
               ┌──────────────────────────────────────────┐
               │              Authenticated User          │
               └────────────────────┬─────────────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
┌─────────────────────────────┐           ┌─────────────────────────────┐
│         Agent Role          │           │         Admin Role          │
├─────────────────────────────┤           ├─────────────────────────────┤
│ • Single-ticket paginated   │           │ • All Agent capabilities    │
│   view navigation           │           │ • User account creation     │
│ • Ticket status & tag       │           │   & role assignment         │
│   updates                   │           │ • Elevated ticket override  │
│ • Optimistic reply          │           │   & administrative controls │
│   submissions               │           │ • System-wide operational   │
│ • Action retry handling     │           │   management                │
└─────────────────────────────┘           └─────────────────────────────┘
```

---

## 6. Team Ownership & Responsibilities

Team ownership boundaries align strictly with the project Team Charter:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Team Ownership                                 │
├───────────────────┬─────────────────────────────┬───────────────────────────┤
│ Team Member       │ Primary Contribution Area   │ Ownership Scope           │
├───────────────────┼─────────────────────────────┼───────────────────────────┤
│ Saud              │ Lane 1: Frontend & UI State │ • Single-ticket paginated │
│                   │                             │   view                    │
│                   │                             │ • Optimistic UI messaging │
│                   │                             │   hooks                   │
│                   │                             │ • UI error handling       │
│                   │                             │ • Retry functionality     │
├───────────────────┼─────────────────────────────┼───────────────────────────┤
│ Deepak            │ Lane 2: Backend API & Auth  │ • Express JWT middleware  │
│                   │                             │ • RBAC middleware         │
│                   │                             │   (isAgent, isAdmin)      │
│                   │                             │ • Ticket REST API         │
│                   │                             │   endpoints               │
├───────────────────┼─────────────────────────────┼───────────────────────────┤
│ Supreeth          │ Lane 3: Database & Messaging│ • Database schema         │
│                   │                             │ • Database migrations     │
│                   │                             │ • Reply submission        │
│                   │                             │   processing              │
│                   │                             │ • Seed scripts            │
└───────────────────┴─────────────────────────────┴───────────────────────────┘
```
