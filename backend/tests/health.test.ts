import request from 'supertest';
import { app } from '../src/app';

describe('GET /api/health', () => {
  it('should return 200 OK with health status and database status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('status', 'ok');
    expect(response.body.data).toHaveProperty('database');
  });
});
