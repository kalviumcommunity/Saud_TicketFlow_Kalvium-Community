import express from 'express';
import request from 'supertest';
import { authenticate } from '../src/middleware/authenticate';
import { isAgent } from '../src/middleware/isAgent';
import { isAdmin } from '../src/middleware/isAdmin';
import { errorHandler } from '../src/middleware/errorHandler';
import { signToken } from '../src/utils/jwt';

describe('JWT Authentication & RBAC Middleware (isAgent & isAdmin)', () => {
  const agentToken = signToken({ id: 'agent-1', email: 'agent@test.com', role: 'AGENT' });
  const adminToken = signToken({ id: 'admin-1', email: 'admin@test.com', role: 'ADMIN' });
  const invalidRoleToken = signToken({ id: 'user-1', email: 'customer@test.com', role: 'CUSTOMER' as any });

  const testApp = express();
  testApp.use(express.json());

  testApp.get('/test/agent', authenticate, isAgent, (_req, res) => {
    res.status(200).json({ success: true, message: 'Agent access granted' });
  });

  testApp.get('/test/admin', authenticate, isAdmin, (_req, res) => {
    res.status(200).json({ success: true, message: 'Admin access granted' });
  });

  testApp.use(errorHandler);

  describe('JWT Authentication Middleware', () => {
    it('should return 401 when Authorization header is missing', async () => {
      const response = await request(testApp).get('/test/agent');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 when JWT token is invalid', async () => {
      const response = await request(testApp)
        .get('/test/agent')
        .set('Authorization', 'Bearer invalid.jwt.token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });

    it('should return 401 when header does not use Bearer scheme', async () => {
      const response = await request(testApp)
        .get('/test/agent')
        .set('Authorization', `Basic ${agentToken}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('isAgent Middleware', () => {
    it('should allow access for valid AGENT token', async () => {
      const response = await request(testApp)
        .get('/test/agent')
        .set('Authorization', `Bearer ${agentToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Agent access granted');
    });

    it('should allow access for valid ADMIN token through isAgent', async () => {
      const response = await request(testApp)
        .get('/test/agent')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Agent access granted');
    });

    it('should return 403 Forbidden for unauthorized roles through isAgent', async () => {
      const response = await request(testApp)
        .get('/test/agent')
        .set('Authorization', `Bearer ${invalidRoleToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });
  });

  describe('isAdmin Middleware', () => {
    it('should return 403 Forbidden for AGENT token through isAdmin', async () => {
      const response = await request(testApp)
        .get('/test/admin')
        .set('Authorization', `Bearer ${agentToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });

    it('should allow access for ADMIN token through isAdmin', async () => {
      const response = await request(testApp)
        .get('/test/admin')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Admin access granted');
    });

    it('should return 403 Forbidden for unauthorized roles through isAdmin', async () => {
      const response = await request(testApp)
        .get('/test/admin')
        .set('Authorization', `Bearer ${invalidRoleToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });
  });
});

