import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../src/utils/jwt';

describe('Ticket REST API & Authorization Boundary (/api/tickets)', () => {
  let agentA: { id: string; email: string; role: 'AGENT' };
  let agentB: { id: string; email: string; role: 'AGENT' };
  let admin: { id: string; email: string; role: 'ADMIN' };

  let tokenAgentA: string;
  let tokenAgentB: string;
  let tokenAdmin: string;

  let ticketA1: any;
  let ticketB1: any;

  beforeAll(async () => {
    await prisma.reply.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();

    const passHash = await bcrypt.hash('password123', 10);

    agentA = (await prisma.user.create({
      data: { email: 'agentA@test.com', name: 'Agent A', password: passHash, role: 'AGENT' },
    })) as any;

    agentB = (await prisma.user.create({
      data: { email: 'agentB@test.com', name: 'Agent B', password: passHash, role: 'AGENT' },
    })) as any;

    admin = (await prisma.user.create({
      data: { email: 'admin@test.com', name: 'Admin', password: passHash, role: 'ADMIN' },
    })) as any;

    tokenAgentA = signToken({ id: agentA.id, email: agentA.email, role: 'AGENT' });
    tokenAgentB = signToken({ id: agentB.id, email: agentB.email, role: 'AGENT' });
    tokenAdmin = signToken({ id: admin.id, email: admin.email, role: 'ADMIN' });

    ticketA1 = await prisma.ticket.create({
      data: {
        title: 'Ticket Agent A 1',
        description: 'Description A1 login issue',
        status: 'OPEN',
        priority: 'HIGH',
        agentId: agentA.id,
        tags: JSON.stringify(['bug', 'frontend']),
      },
    });

    ticketB1 = await prisma.ticket.create({
      data: {
        title: 'Ticket Agent B 1',
        description: 'Description B1 database connection',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        agentId: agentB.id,
        tags: JSON.stringify(['feature']),
      },
    });
  });

  afterAll(async () => {
    await prisma.reply.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('Headers & Structured Request Tracing', () => {
    it('Should include X-Request-ID trace header in response', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.headers['x-request-id']).toBeDefined();
    });

    it('Should propagate client custom X-Request-ID header if provided', async () => {
      const customId = 'custom-client-trace-12345';
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .set('X-Request-ID', customId);

      expect(response.status).toBe(200);
      expect(response.headers['x-request-id']).toBe(customId);
    });
  });

  describe('POST /api/tickets (Create Ticket)', () => {
    it('Authenticated Agent should create ticket with HTTP 201 Created', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${tokenAgentA}`)
        .send({
          title: 'Newly Created Ticket',
          description: 'Detailed problem report',
          priority: 'URGENT',
          tags: ['urgent', 'backend'],
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Newly Created Ticket');
      expect(response.body.data.priority).toBe('URGENT');
      expect(response.body.data.tags).toEqual(['urgent', 'backend']);
      expect(response.body.data.agentId).toBe(agentA.id);
    });

    it('Should reject ticket creation with missing required title (400 Bad Request)', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${tokenAgentA}`)
        .send({
          description: 'Description without title',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('BAD_REQUEST');
    });

    it('Should reject ticket creation with missing required description (400 Bad Request)', async () => {
      const response = await request(app)
        .post('/api/tickets')
        .set('Authorization', `Bearer ${tokenAgentA}`)
        .send({
          title: 'Title without description',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/tickets (Search, Filter, & Ownership Isolation)', () => {
    it('Agent A should only receive tickets assigned to Agent A', async () => {
      const response = await request(app)
        .get('/api/tickets?page=1&limit=10')
        .set('Authorization', `Bearer ${tokenAgentA}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.pagination.total).toBeGreaterThanOrEqual(1);
      expect(response.body.data.every((t: any) => t.agentId === agentA.id)).toBe(true);
    });

    it('Admin should receive system-wide tickets', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.pagination.total).toBeGreaterThanOrEqual(2);
    });

    it('Should filter tickets by status and priority query parameters', async () => {
      const response = await request(app)
        .get('/api/tickets?status=OPEN&priority=HIGH')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every((t: any) => t.status === 'OPEN' && t.priority === 'HIGH')).toBe(true);
    });

    it('Should search tickets by term in title or description', async () => {
      const response = await request(app)
        .get('/api/tickets?search=database')
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.some((t: any) => t.id === ticketB1.id)).toBe(true);
    });

    it('Should reject invalid pagination query parameters', async () => {
      const response = await request(app)
        .get('/api/tickets?page=-1&limit=500')
        .set('Authorization', `Bearer ${tokenAgentA}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('BAD_REQUEST');
    });
  });

  describe('GET /api/tickets/:id (Ticket Ownership Security)', () => {
    it('Agent A should successfully access ticket assigned to Agent A', async () => {
      const response = await request(app)
        .get(`/api/tickets/${ticketA1.id}`)
        .set('Authorization', `Bearer ${tokenAgentA}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(ticketA1.id);
      expect(response.body.data.tags).toEqual(['bug', 'frontend']);
    });

    it('Agent A MUST NOT be able to access Agent B ticket by ID (Security Enforcement)', async () => {
      const response = await request(app)
        .get(`/api/tickets/${ticketB1.id}`)
        .set('Authorization', `Bearer ${tokenAgentA}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('Admin can access any ticket by ID', async () => {
      const response = await request(app)
        .get(`/api/tickets/${ticketB1.id}`)
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(ticketB1.id);
    });
  });

  describe('PATCH /api/tickets/:id (Metadata Updates & Allowlist)', () => {
    it('Agent A should update status of assigned ticket A1', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${ticketA1.id}`)
        .set('Authorization', `Bearer ${tokenAgentA}`)
        .send({ status: 'RESOLVED', tags: ['bug', 'resolved'] });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('RESOLVED');
      expect(response.body.data.tags).toEqual(['bug', 'resolved']);
    });

    it('Agent A MUST NOT be able to update Agent B ticket', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${ticketB1.id}`)
        .set('Authorization', `Bearer ${tokenAgentA}`)
        .send({ status: 'CLOSED' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('Should reject invalid status value (400 Bad Request)', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${ticketA1.id}`)
        .set('Authorization', `Bearer ${tokenAgentA}`)
        .send({ status: 'INVALID_STATUS' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('Agent cannot reassign ticket to another agent (403 Forbidden)', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${ticketA1.id}`)
        .set('Authorization', `Bearer ${tokenAgentA}`)
        .send({ agentId: agentB.id });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('Admin can reassign ticket to another agent', async () => {
      const response = await request(app)
        .patch(`/api/tickets/${ticketA1.id}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({ agentId: agentB.id });

      expect(response.status).toBe(200);
      expect(response.body.data.agentId).toBe(agentB.id);
    });
  });

  describe('POST /api/tickets/:id/attachments (File Upload Support)', () => {
    it('Should upload attachment metadata successfully with 201 Created', async () => {
      const response = await request(app)
        .post(`/api/tickets/${ticketB1.id}/attachments`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({
          fileName: 'log-trace.txt',
          fileType: 'text/plain',
          fileSize: 1024,
          contentBase64: 'data:text/plain;base64,SGVsbG8gV29ybGQ=',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.fileName).toBe('log-trace.txt');
      expect(response.body.data.fileType).toBe('text/plain');
      expect(response.body.data.fileSize).toBe(1024);
      expect(response.body.data.url).toBeDefined();
    });

    it('Should reject unsupported attachment MIME types (400 Bad Request)', async () => {
      const response = await request(app)
        .post(`/api/tickets/${ticketB1.id}/attachments`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({
          fileName: 'malicious.exe',
          fileType: 'application/x-msdownload',
          fileSize: 2048,
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('BAD_REQUEST');
    });

    it('Should reject attachments exceeding 5MB size limit (400 Bad Request)', async () => {
      const response = await request(app)
        .post(`/api/tickets/${ticketB1.id}/attachments`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({
          fileName: 'huge_video.mp4',
          fileType: 'image/png',
          fileSize: 10 * 1024 * 1024, // 10MB
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/tickets/:id (Ticket Deletion)', () => {
    it('Agent B MUST NOT be able to delete Agent A assigned ticket (403 Forbidden)', async () => {
      const response = await request(app)
        .delete(`/api/tickets/${ticketA1.id}`)
        .set('Authorization', `Bearer ${tokenAgentA}`); // ticketA1 was reassigned to agentB in patch test above

      // Agent A is no longer the assigned agent of ticketA1
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('Admin can delete any ticket (200 OK)', async () => {
      const response = await request(app)
        .delete(`/api/tickets/${ticketA1.id}`)
        .set('Authorization', `Bearer ${tokenAdmin}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
