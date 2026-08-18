import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '../src/utils/jwt';

describe('Authentication API & Middleware (/api/auth)', () => {
  let testUser: { id: string; email: string; name: string; role: 'AGENT' };

  beforeAll(async () => {
    // Seed a test user
    await prisma.reply.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await prisma.user.create({
      data: {
        email: 'agent1@freshagent.com',
        name: 'Agent One',
        password: hashedPassword,
        role: 'AGENT',
      },
    }) as any;
  });

  afterAll(async () => {
    await prisma.reply.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  describe('POST /api/auth/login', () => {
    it('should successfully authenticate with valid credentials and return JWT', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'agent1@freshagent.com',
        password: 'password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('agent1@freshagent.com');
      expect(response.body.data.user.role).toBe('AGENT');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should reject login with wrong password (401)', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'agent1@freshagent.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject login with non-existent email (401)', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@freshagent.com',
        password: 'password123',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject login with missing fields (400)', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'agent1@freshagent.com',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('BAD_REQUEST');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return profile for authenticated request with valid Bearer token', async () => {
      const token = signToken({ id: testUser.id, email: testUser.email, role: testUser.role });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('agent1@freshagent.com');
      expect(response.body.data.role).toBe('AGENT');
    });

    it('should reject request without Authorization header (401)', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should reject request with malformed token (401)', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token_str');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject request without Bearer scheme (401)', async () => {
      const token = signToken({ id: testUser.id, email: testUser.email, role: testUser.role });
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Basic ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
