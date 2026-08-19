import { Ticket } from "@/types";

export const INITIAL_MOCK_TICKETS: Ticket[] = [
  {
    id: "TCK-1042",
    title: "API rate limits exceeded on production webhooks",
    description:
      "Starting at 09:15 UTC today, our automated integration webhooks started receiving HTTP 429 Too Many Requests responses from the endpoint `/v2/webhooks/deliver`. Our payload dispatchers are currently holding 4,500 un-delivered event payloads in our dead-letter queue. We need immediate rate limit adjustment for our production API keys to clear the backlog before SLA expiration.",
    status: "OPEN",
    priority: "URGENT",
    createdAt: "2026-08-19T09:15:00Z",
    updatedAt: "2026-08-19T09:45:00Z",
    agentId: "usr-agent-01",
    agentName: "Agent Alex",
    customerName: "Sarah Connor",
    customerEmail: "s.connor@acmecorp.com",
    customerCompany: "Acme Corp",
    tags: ["webhooks", "production", "rate-limit", "api-v2"],
    repliesCount: 2,
    replies: [
      {
        id: "rpl-101",
        ticketId: "TCK-1042",
        userId: "cust-01",
        userName: "Sarah Connor",
        userRole: "CUSTOMER",
        content:
          "Hi team, we noticed a sharp spike in HTTP 429s across all our webhook workers. Could you verify if the default bucket size was throttled during the recent infra maintenance?",
        createdAt: "2026-08-19T09:18:00Z",
      },
      {
        id: "rpl-102",
        ticketId: "TCK-1042",
        userId: "usr-agent-01",
        userName: "Agent Alex",
        userRole: "AGENT",
        content:
          "Hello Sarah! Thanks for reaching out. I am looking into our API Gateway rate limit configuration right now. It appears the tier limit was temporarily reset during this morning's routine deployment. I am preparing a patch for your account limits.",
        createdAt: "2026-08-19T09:30:00Z",
      },
    ],
  },
  {
    id: "TCK-1041",
    title: "SSO SAML login redirection failure",
    description:
      "Enterprise users logging in via Okta SAML 2.0 single sign-on are encountering a 500 error after authenticating at their IdP prompt. The redirect URL `/auth/saml/callback` yields invalid signature verification errors.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    createdAt: "2026-08-19T08:30:00Z",
    updatedAt: "2026-08-19T09:15:00Z",
    agentId: "usr-agent-01",
    agentName: "Agent Alex",
    customerName: "Marcus Vance",
    customerEmail: "m.vance@starlightmedia.io",
    customerCompany: "Starlight Media",
    tags: ["sso", "saml", "okta", "auth"],
    repliesCount: 3,
    replies: [
      {
        id: "rpl-201",
        ticketId: "TCK-1041",
        userId: "cust-02",
        userName: "Marcus Vance",
        userRole: "CUSTOMER",
        content:
          "Our employees cannot log into FreshAgent Hub using Okta SSO this morning. Here is the stack trace: SAMLValidationError: Digest mismatch on Assertion.",
        createdAt: "2026-08-19T08:32:00Z",
      },
      {
        id: "rpl-202",
        ticketId: "TCK-1041",
        userId: "usr-agent-01",
        userName: "Agent Alex",
        userRole: "AGENT",
        content:
          "Thanks Marcus. It looks like the x509 cert fingerprint on your Okta tenant was rotated yesterday. Could you re-upload your metadata XML file under Settings > Security?",
        createdAt: "2026-08-19T08:50:00Z",
      },
      {
        id: "rpl-203",
        ticketId: "TCK-1041",
        userId: "cust-02",
        userName: "Marcus Vance",
        userRole: "CUSTOMER",
        content:
          "We uploaded the new cert, but still seeing signature errors on secondary domain accounts.",
        createdAt: "2026-08-19T09:15:00Z",
      },
    ],
  },
  {
    id: "TCK-1039",
    title: "Dashboard analytics metrics out of sync",
    description:
      "The 'Total Tickets Resolved' widget on the main executive dashboard is reporting 142 tickets, whereas export CSV reports show 189 resolved tickets for the current billing cycle.",
    status: "OPEN",
    priority: "MEDIUM",
    createdAt: "2026-08-19T07:10:00Z",
    updatedAt: "2026-08-19T07:10:00Z",
    agentId: "usr-agent-01",
    agentName: "Agent Alex",
    customerName: "Elena Rostova",
    customerEmail: "elena@nexuslabs.com",
    customerCompany: "Nexus Labs",
    tags: ["analytics", "reporting", "dashboard"],
    repliesCount: 1,
    replies: [
      {
        id: "rpl-301",
        ticketId: "TCK-1039",
        userId: "cust-03",
        userName: "Elena Rostova",
        userRole: "CUSTOMER",
        content:
          "Please verify why the dashboard metric counter isn't reflecting tickets resolved via automated workflows.",
        createdAt: "2026-08-19T07:10:00Z",
      },
    ],
  },
  {
    id: "TCK-1035",
    title: "Request for billing address update on invoice",
    description:
      "We updated our corporate entity location from San Francisco to Austin, Texas. We need updated tax documentation (W-9) and invoice headers updated for INV-2026-0891.",
    status: "OPEN",
    priority: "LOW",
    createdAt: "2026-08-19T05:00:00Z",
    updatedAt: "2026-08-19T05:00:00Z",
    agentId: "usr-agent-01",
    agentName: "Agent Alex",
    customerName: "David Chen",
    customerEmail: "david.c@cloudscale.net",
    customerCompany: "Cloud Scale Inc",
    tags: ["billing", "invoice", "address"],
    repliesCount: 1,
    replies: [
      {
        id: "rpl-401",
        ticketId: "TCK-1035",
        userId: "cust-04",
        userName: "David Chen",
        userRole: "CUSTOMER",
        content:
          "Hi, please send the amended invoice for INV-2026-0891 to billing@cloudscale.net with Texas tax ID.",
        createdAt: "2026-08-19T05:00:00Z",
      },
    ],
  },
];
