const request = require('supertest');
const app = require('../src/app');

describe('Node IAM Auth API', () => {
  let userToken;
  let adminToken;

  it('should login successfully as user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'user', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.access_token).toBeDefined();
    userToken = res.body.access_token;
  });

  it('should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'user', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  it('should allow access to /users/me with token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('user');
  });

  it('should deny regular user access to admin route', async () => {
    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('should allow admin access to admin route', async () => {
    // Get admin token
    const loginRes = await request(app)
      .post('/api/login')
      .send({ username: 'admin', password: 'password123' });
    adminToken = loginRes.body.access_token;

    const res = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
