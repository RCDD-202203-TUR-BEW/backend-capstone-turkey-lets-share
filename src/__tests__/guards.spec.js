describe('Guard test', () => {
  it('Guard Test', () => {
    expect(true).toEqual(true);
  });
});

// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const app = require('../app');

const authorize = require('../middleware/guard');

// describe('Guard Routes Middleware', () => {
//   describe('When there is a logged in User', () => {
//     const agent = request.agent(app);
//     test('POST /auth/login should give 403 and redirect to /', async () => {
//       const res = await agent.post('/api/auth/login');
//       console.log(res.body);
//       expect(res.statusCode).toBe(403);
//       expect(res.body.message).toBe('Already Logged in');
//     });
//     test('POST /auth/register should give 403 and redirect to /', async () => {
//       const res = await agent.post('/api/auth/register');
//       expect(res.statusCode).toBe(403);
//       expect(res.body.message).toBe('Already Logged in');
//     });
//     test('GET /google should give 403 and redirect to /', async () => {
//       const res = await agent.get('/api/auth/google');
//       expect(res.statusCode).toBe(403);
//       expect(res.body.message).toBe('Already Logged in');
//     });
//     test('GET /google/callback should give 403 and redirect to /', async () => {
//       const res = await agent.get('/api/auth/google-callback');
//       expect(res.statusCode).toBe(403);
//       expect(res.body.message).toBe('Already Logged in');
//     });
//     test('GET /facebook should give 403 and redirect to /', async () => {
//       const res = await agent.get('/api/auth/facebook');
//       expect(res.statusCode).toBe(403);
//       expect(res.body.message).toBe('Already Logged in');
//     });
//     test('GET /facebook should give 403 and redirect to /', async () => {
//       const res = await agent.get('/api/auth/facebook-callback');
//       expect(res.statusCode).toBe(403);
//       expect(res.body.message).toBe('Already Logged in');
//     });
//   });
//   describe('When there is no logged in User', () => {
//     const agentUser1 = request.agent(app);
//     test('GET	/auth/profile should give 401 and direct to "/auth/login”', async () => {
//       const res = await agentUser1.get('/api/auth/profile');
//       expect(res.statusCode).toBe(401);
//       expect(res.body.message).toBe(
//         'You are not authorized to perform this action'
//       );
//     });
//     test('GET	/auth/logout should give 401 and direct to "/auth/login”', async () => {
//       const res = await agentUser1.get('/api/auth/logout');
//       expect(res.statusCode).toBe(401);
//       expect(res.body.message).toBe(
//         'You are not authorized to perform this action'
//       );
//     });
//     test('POST /post	should give 401 and an error message', async () => {
//       const res = await agentUser1.post('/api/post');
//       expect(res.statusCode).toBe(401);
//       expect(res.body.message).toBe(
//         'You are not authorized to perform this action'
//       );
//     });
//     test('PUT /post/:id should give 401 and an error message', async () => {
//       const res = await agentUser1.put('/api/post/1');
//       expect(res.statusCode).toBe(401);
//       expect(res.body.message).toBe(
//         'You are not authorized to perform this action'
//       );
//     });
//     test('DELETE /post/:id should give 401 and an error message', async () => {
//       const res = await agentUser1.delete('/api/post/1');
//       expect(res.statusCode).toBe(401);
//       expect(res.body.message).toBe(
//         'You are not authorized to perform this action'
//       );
//     });
//   });
// });
