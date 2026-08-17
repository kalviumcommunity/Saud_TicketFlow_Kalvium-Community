# FreshAgent Hub — Development Context

This document outlines the project scope, technical context, development conventions, security policies, and performance goals for **FreshAgent Hub — Performance-Optimized Support Interface**.

---

## 1. Project Purpose & Scope

FreshAgent Hub is a high-performance customer support agent workspace designed to streamline ticket resolution workflows. The system prioritizes rapid rendering of ticket interfaces, instant response feedback via optimistic UI updates, and backend role-based access control.

### Current Implementation Status vs. MVP Scope

> [!NOTE]
> **Issue #1 Status**: This repository currently contains initial setup and documentation establishing project architecture and development context. Application source code, database models, and API endpoints defined herein represent planned MVP deliverables.

```text
┌─────────────────────────────────────────┐
│     Current State (Issue #1 Docs)       │
│ • Architecture Specification             │
│ • Development Context Rules             │
│ • Planned API Contract                  │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│           Planned MVP Deliverables      │
│ • Single-ticket paginated view          │
│ • Optimistic UI messaging & retry       │
│ • Express REST API & Ticket endpoints   │
│ • JWT authentication & RBAC middleware  │
│ • Prisma schema, migrations & seeds     │
└────────────────────┬────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────┐
│        Future / Out of Scope            │
│ • Phase 2 / Enterprise extensions       │
└─────────────────────────────────────────┘
```

---

## 2. MVP Functionality

The Minimum Viable Product (MVP) covers core single-agent support operations:

1. **Single-Ticket Paginated View**: Efficient client-side ticket detail display allowing agents to navigate paginated ticket lists without full-page reloads.
2. **Optimistic UI Messaging**: Instant visual confirmation when posting ticket replies, backed by background server sync.
3. **UI Error Handling & Retry**: Detection of failed messaging network requests with UI error states and one-click retry capabilities.
4. **JWT Authentication**: Stateless authentication securing API interactions.
5. **RBAC Middleware (`isAgent`, `isAdmin`)**: Server-enforced role verification for ticket actions.
6. **Ticket REST API**: Structured REST endpoints for fetching and updating ticket resources.
7. **Database Schema & Migrations**: PostgreSQL relational schema managed via Prisma ORM with seed data for development.
8. **Reply Submission Processing**: Server-side processing and storage of ticket replies.

---

## 3. Explicitly Out-of-Scope Features (Phase 2 / Excluded)

To maintain focused execution on MVP objectives, the following features are **explicitly out of scope**:

- ❌ Single Sign-On (SSO) / SAML authentication
- ❌ File attachments (images, documents, PDFs)
- ❌ Real-time video/audio calls
- ❌ Automatic ticket routing / auto-assignment algorithms
- ❌ Service Level Agreement (SLA) timers or management
- ❌ Advanced analytics dashboards & CSAT export tools
- ❌ Split-screen multi-ticket view layout
- ❌ Custom theme engines or user styling customization

---

## 4. Major Modules

```text
Saud_TicketFlow_Kalvium-Community/
├── docs/                               # Project Architecture & API Contracts
├── frontend/                           # Next.js Presentation Layer (Planned MVP)
│   └── (Single-ticket view, Optimistic UI, Retry logic)
├── backend/                            # Express REST API Layer (Planned MVP)
│   └── (JWT auth middleware, RBAC middleware, Ticket routes)
└── database/                           # Prisma Data Access Layer (Planned MVP)
    └── (Prisma schema, migrations, seed scripts)
```

---

## 5. Technology Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **Backend Runtime & Framework**: Node.js + Express
- **API Architecture**: REST API (JSON payloads)
- **Authentication**: JWT (JSON Web Tokens)
- **Authorization**: Custom Express RBAC middleware (`isAgent`, `isAdmin`)
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Deployment Target**: GCP-compatible infrastructure

---

## 6. Established Development Conventions

All team members must strictly follow the development workflow established in the Team Charter:

### GitHub Branching Policy
- **Direct commits to `main` are strictly prohibited.**
- Every team member must work in a dedicated feature branch using the prefix `feature/` (e.g., `feature/jwt-auth`, `feature/ticket-schema`).

### Pull Request (PR) Requirements
- Every PR requires **at least one teammate review and approval** before merging into `main`.
- PR descriptions must clearly state:
  1. What was implemented.
  2. Concrete evidence of testing.
  3. The applicable concept or issue ID.

### Team Communication & Working Hours
- **Primary Channel**: WhatsApp Group Chat for real-time updates and urgent issues.
- **Core Hours**: 1:15 PM – 4:30 PM IST (covering SW Daily Block and standups).
- **Blocker Rule**: If blocked on any task for **more than 30 minutes**, notify the WhatsApp group immediately. Do not stay silently blocked.
- **Daily Journal**: Every member must complete their individual daily journal before **11:59 PM** daily.

### Conflict Resolution Protocol
1. **Architecture Decisions**: Discuss differences for a maximum of **15 minutes**. If unresolved, resolve via team vote or consult mentor.
2. **Progress Issues**: Raise blockers during daily standups to reallocate tasks or initiate pair programming.

---

## 7. Important Security Rules

1. **Server-Enforced RBAC**: Never trust client-side state for access control. Express middleware (`isAgent`, `isAdmin`) must validate roles on every restricted request.
2. **Bearer Token Validation**: Protected backend routes must mandate valid `Authorization: Bearer <jwt>` headers.
3. **Secret Management**: JWT secrets, database connection strings, and API keys must be loaded via environment variables (`.env`) and never committed to version control.
4. **Input Sanitization**: All incoming request bodies and route parameters must be validated and sanitized on the backend prior to database operations.

---

## 8. Important Performance Targets

1. **Paginated View Efficiency**: Single-ticket view must render quickly without full page refreshes.
2. **Optimistic UI Response**: Reply submissions must reflect immediately in the UI state (< 50ms perception) while background API processing completes.
3. **Resilient Retry Handling**: Transient network failures during message delivery must be recoverable via explicit UI retry triggers without requiring page reload or data re-entry.
