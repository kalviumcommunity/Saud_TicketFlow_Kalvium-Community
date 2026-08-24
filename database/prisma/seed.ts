import { PrismaClient, Role, TicketStatus, Priority } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables from .env if present
dotenv.config();

const prisma = new PrismaClient();

// Standard bcrypt hash for "password123" with 10 salt rounds
const DEFAULT_PASSWORD_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

/**
 * Seed script for FreshAgent Hub.
 * Populates sample AGENT, ADMIN, and Customer users, tickets, and replies
 * strictly adhering to the Prisma schema definitions.
 *
 * Designed to be fully idempotent (safe to run multiple times without duplicating data).
 */
async function main() {
  console.log('🌱 Starting FreshAgent Hub database seed...\n');

  // ------------------------------------------------------
  // 1. Seed Users (ADMIN, AGENT, Customer)
  // ------------------------------------------------------
  console.log('👤 Seeding Users...');

  const usersData = [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      email: 'admin@freshagent.com',
      name: 'System Administrator',
      password: DEFAULT_PASSWORD_HASH,
      role: Role.ADMIN,
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      email: 'agent1@freshagent.com',
      name: 'Agent One',
      password: DEFAULT_PASSWORD_HASH,
      role: Role.AGENT,
    },
    {
      id: 'a0000000-0000-0000-0000-000000000003',
      email: 'agent2@freshagent.com',
      name: 'Agent Two',
      password: DEFAULT_PASSWORD_HASH,
      role: Role.AGENT,
    },
    {
      id: 'c0000000-0000-0000-0000-000000000001',
      email: 'customer1@example.com',
      name: 'Jane Doe',
      password: DEFAULT_PASSWORD_HASH,
      role: Role.AGENT,
    },
  ];

  const seededUsers = [];
  for (const user of usersData) {
    const upsertedUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: user.password,
        role: user.role,
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
      },
    });
    seededUsers.push(upsertedUser);
    console.log(`  ✓ User: ${upsertedUser.name} <${upsertedUser.email}> [Role: ${upsertedUser.role}]`);
  }

  // ------------------------------------------------------
  // 2. Seed Tickets
  // ------------------------------------------------------
  console.log('\n🎫 Seeding Tickets...');

  const ticketsData = [
    {
      id: 't0000000-0000-0000-0000-000000000001',
      title: 'Cannot access billing dashboard after subscription renewal',
      description: 'Customer reports receiving a 403 Forbidden error when trying to access the invoice downloads page following their annual plan renewal.',
      status: TicketStatus.OPEN,
      priority: Priority.HIGH,
      agentId: 'a0000000-0000-0000-0000-000000000002', // Agent One
      customerId: 'c0000000-0000-0000-0000-000000000001',
      tags: JSON.stringify(['billing', 'subscription', 'ui']),
    },
    {
      id: 't0000000-0000-0000-0000-000000000002',
      title: 'Password reset emails not arriving in inbox',
      description: 'Several users in the EMEA region reported that password reset notification emails are delayed or dropped by the mail server.',
      status: TicketStatus.IN_PROGRESS,
      priority: Priority.URGENT,
      agentId: 'a0000000-0000-0000-0000-000000000002', // Agent One
      customerId: 'c0000000-0000-0000-0000-000000000001',
      tags: JSON.stringify(['auth', 'email', 'security']),
    },
    {
      id: 't0000000-0000-0000-0000-000000000003',
      title: 'Dark mode toggle causing text contrast regression on ticket table',
      description: 'When toggling dark theme in the agent portal, secondary column text color fails to adjust, resulting in low contrast ratio.',
      status: TicketStatus.RESOLVED,
      priority: Priority.MEDIUM,
      agentId: 'a0000000-0000-0000-0000-000000000003', // Agent Two
      customerId: 'c0000000-0000-0000-0000-000000000001',
      tags: JSON.stringify(['frontend', 'accessibility', 'styling']),
    },
    {
      id: 't0000000-0000-0000-0000-000000000004',
      title: 'Feature request: Export ticket history to CSV',
      description: 'Customer requested capability to export full ticket history and reply transcripts as CSV/Excel for audit compliance.',
      status: TicketStatus.CLOSED,
      priority: Priority.LOW,
      agentId: 'a0000000-0000-0000-0000-000000000003', // Agent Two
      customerId: 'c0000000-0000-0000-0000-000000000001',
      tags: JSON.stringify(['feature-request', 'reporting', 'export']),
    },
    {
      id: 't0000000-0000-0000-0000-000000000005',
      title: 'Outbound webhook delivery failure for Slack notifications',
      description: 'Outbound webhook notifications to Slack channels are failing with HTTP 500 error code since the latest release.',
      status: TicketStatus.OPEN,
      priority: Priority.URGENT,
      agentId: null, // Unassigned ticket
      customerId: 'c0000000-0000-0000-0000-000000000001',
      tags: JSON.stringify(['integration', 'webhooks', 'slack', 'bug']),
    },
  ];

  const seededTickets = [];
  for (const ticket of ticketsData) {
    const upsertedTicket = await prisma.ticket.upsert({
      where: { id: ticket.id },
      update: {
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        agentId: ticket.agentId,
        customerId: ticket.customerId,
        tags: ticket.tags,
      },
      create: {
        id: ticket.id,
        title: ticket.title,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        agentId: ticket.agentId,
        customerId: ticket.customerId,
        tags: ticket.tags,
      },
    });
    seededTickets.push(upsertedTicket);
    console.log(`  ✓ Ticket: "${upsertedTicket.title}" [Status: ${upsertedTicket.status}, Priority: ${upsertedTicket.priority}]`);
  }

  // ------------------------------------------------------
  // 3. Seed Replies
  // ------------------------------------------------------
  console.log('\n💬 Seeding Replies...');

  const repliesData = [
    {
      id: 'r0000000-0000-0000-0000-000000000001',
      ticketId: 't0000000-0000-0000-0000-000000000001',
      userId: 'a0000000-0000-0000-0000-000000000002', // Agent One
      content: 'Hello Jane, thank you for reaching out. We are investigating your billing permissions and will update you shortly.',
    },
    {
      id: 'r0000000-0000-0000-0000-000000000002',
      ticketId: 't0000000-0000-0000-0000-000000000001',
      userId: 'c0000000-0000-0000-0000-000000000001', // Customer Jane Doe
      content: 'Thank you, please let me know as we need to export our VAT invoice for accounting reconciliation.',
    },
    {
      id: 'r0000000-0000-0000-0000-000000000003',
      ticketId: 't0000000-0000-0000-0000-000000000002',
      userId: 'a0000000-0000-0000-0000-000000000001', // Admin
      content: 'Checking email delivery logs and SMTP bounce rates with our relay provider.',
    },
    {
      id: 'r0000000-0000-0000-0000-000000000004',
      ticketId: 't0000000-0000-0000-0000-000000000002',
      userId: 'a0000000-0000-0000-0000-000000000002', // Agent One
      content: 'Identified rate limit throttling on the EU relay server. Re-routing queue to secondary gateway.',
    },
    {
      id: 'r0000000-0000-0000-0000-000000000005',
      ticketId: 't0000000-0000-0000-0000-000000000003',
      userId: 'a0000000-0000-0000-0000-000000000003', // Agent Two
      content: 'Patched CSS custom properties in the theme provider. High-contrast tokens verified in staging.',
    },
    {
      id: 'r0000000-0000-0000-0000-000000000006',
      ticketId: 't0000000-0000-0000-0000-000000000004',
      userId: 'a0000000-0000-0000-0000-000000000001', // Admin
      content: 'Logged this feature request in the product backlog under Compliance & Reporting milestone.',
    },
  ];

  const seededReplies = [];
  for (const reply of repliesData) {
    const upsertedReply = await prisma.reply.upsert({
      where: { id: reply.id },
      update: {
        ticketId: reply.ticketId,
        userId: reply.userId,
        content: reply.content,
      },
      create: {
        id: reply.id,
        ticketId: reply.ticketId,
        userId: reply.userId,
        content: reply.content,
      },
    });
    seededReplies.push(upsertedReply);
    console.log(`  ✓ Reply on Ticket ${upsertedReply.ticketId}: "${upsertedReply.content.slice(0, 45)}..."`);
  }

  console.log('\n======================================================');
  console.log(`✅ Database seed completed successfully!`);
  console.log(`   - Users:   ${seededUsers.length}`);
  console.log(`   - Tickets: ${seededTickets.length}`);
  console.log(`   - Replies: ${seededReplies.length}`);
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

