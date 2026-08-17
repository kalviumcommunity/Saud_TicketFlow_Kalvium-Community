import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../src/utils/jwt';

describe('Reply Thread API (/api/tickets/:id/replies)', () => {
  let agentA: { id: string; email: string };
  let agentB: { id: string; email: string };
  let tokenAgentA: string;
  let tokenAgentB: string;
  let ticketA: any;

  beforeAll(async () => {
    await prisma.reply.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();

    const passHash = await bcrypt.hash('password123', 10);

    agentA = (await prisma.user.create({
      data: { email: 'agentA_reply@test.com', name: 'Agent A Reply', password: passHash, role: 'AGENT' },
    })) as any;

    agentB = (await prisma.user.create({
      data: { email: 'agentB_reply@test.com', name: 'Agent B Reply', password: passHash, role: 'AGENT' },
    })) as any;

    tokenAgentA = signToken({ id: agentA.id, email: agentA.email, role: 'AGENT' });
    tokenAgentB = signToken({ id: agentB.id, email: agentB.email, role: 'AGENT' });

    ticketA = await prisma.ticket.create({
      data: {
        title: 'Ticket for Reply Test',
        description: 'Testing reply endpoints',
        status: 'OPEN',
        priority: 'MEDIUM',
        agentId: agentA.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.reply.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/tickets/:id/replies', () => {
    it('Authenticated assigned agent should submit reply and receive HTTP 201 Created', async () => {
      const response = await request(app)
        .post(`/api/tickets/${ticketA.id}/replies`)
        .set('Authorization', `Bearer ${tokenAgentA}`)
        .send({ content: 'We are investigating this issue right away.' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe('We are investigating this issue right away.');
      expect(response.body.data.ticketId).toBe(ticketA.id);
      expect(response.body.data.userId).toBe(agentA.id);
      expect(response.body.data.user.name).toBe('Agent A Reply');
    });

    it('Should support "message" body parameter for optimistic UI contract compatibility', async () => {
      const response = await request(app)
        .post(`/api/tickets/${ticketA.id}/replies`)
        .set('Authorization', `Bearer ${tokenAgentA}`)
        .send({ message: 'Another reply using message field.' });

      expect(response.status).toBe(201);
      expect(response.body.data.content).toBe('Another reply using message field.');
    });

    it('Agent B MUST NOT be able to submit reply to Agent A ticket', async () => {
      const response = await request(app)
        .post(`/api/tickets/${ticketA.id}/replies`)
        .set('Authorization', `Bearer ${tokenAgentB}`)
        .send({ content: 'Unauthorized reply attempt' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('Unauthenticated user request MUST be rejected with HTTP 401', async () => {
      const response = await request(app)
        .post(`/api/tickets/${ticketA.id}/replies`)
        .send({ content: 'No token reply' });

      expect(response.status).toBe(401);
    });

    it('Invalid reply with empty content MUST be rejected with HTTP 400', async () => {
      const response = await request(app)
        .post(`/api/tickets/${ticketA.id}/replies`)
        .set('Authorization', `Bearer ${tokenAgentA}`)
        .send({ content: '   ' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tickets/:id/replies', () => {
    it('Assigned agent should fetch reply thread history', async () => {
      const response = await request(app)
        .get(`/api/tickets/${ticketA.id}/replies`)
        .set('Authorization', `Bearer ${tokenAgentA}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
    });
  });
});
