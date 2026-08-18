import request from 'supertest';
import { app } from '../src/app';
import { signToken } from '../src/utils/jwt';

describe('RBAC Middleware (isAgent & isAdmin)', () => {
  const agentToken = signToken({ id: 'agent-1', email: 'agent@test.com', role: 'AGENT' });
  const adminToken = signToken({ id: 'admin-1', email: 'admin@test.com', role: 'ADMIN' });
  const invalidRoleToken = signToken({ id: 'user-1', email: 'customer@test.com', role: 'CUSTOMER' as any });

  describe('isAgent Middleware on /api/tickets', () => {
    it('should allow access for AGENT role', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${agentToken}`);

      // Should pass authorization (status 200)
      expect(response.status).toBe(200);
    });

    it('should allow access for ADMIN role', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
    });

    it('should reject access for unauthorized roles with 403 Forbidden', async () => {
      const response = await request(app)
        .get('/api/tickets')
        .set('Authorization', `Bearer ${invalidRoleToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('FORBIDDEN');
    });
  });
});
