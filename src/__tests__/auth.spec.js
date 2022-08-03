// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const app = require('../app');
const connectDatabase = require('../db/connection');
const UserModal = require('../models/user');

const validUserExample = {
  email: 'amjad@gmail.com',
  password: 'Nilay-123',
};

beforeAll(async () => {
  await connectDatabase();
  await UserModal.create({
    firstName: 'nilo',
    lastName: 'sihebi',
    email: 'amjad@gmail.com',
    username: 'ezgiAndRama',
    phoneNumber: 5555555,
    age: 18,
    gender: 'Female',
    nationality: 'Syria',
    refugee: true,
    provider: 'Local',
    providerId: 'Local',
    passwordHash:
      '$2b$10$vEoUN3L9gMDBB8XtoTQf8OKBBGJt.XJDmBacITlS83tvlIUOJH4Dy',
  });
});

afterAll(async () => {
  await UserModal.deleteMany({});
});

let jwtToken = null;
describe('AUTH TESTS', () => {
  describe('POST /api/auth/login', () => {
    it('should return a token in a cookie and success message ', (done) => {
      request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: validUserExample.email,
          password: validUserExample.password,
        })
        .expect('Content-Type', /json/)
        .expect(201, (err, res) => {
          if (err) return done(err);
          expect(res.headers['set-cookie']).toBeDefined();
          expect(res.headers['set-cookie']).toBeTruthy();
          expect(res.body.message).toBe('User sucesfully signed in!');
          // eslint-disable-next-line prefer-destructuring
          jwtToken = res.headers['set-cookie'][0].split(';')[0];
          return done();
        });
    });
    it('should return an error when email thats not registered is used', (done) => {
      request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'wrongemail@wrongemail.com',
          password: validUserExample.password,
        })
        .expect('Content-Type', /json/)
        .expect(401, (err, res) => {
          if (err) return done(err);
          expect(res.body.message).toBe('Wrong email or password!');
          return done();
        });
    });
    it('should return an error when password thats not registered is used', (done) => {
      request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: validUserExample.email,
          password: 'wrongpasswordthaticreatedfortestpurposes',
        })
        .expect('Content-Type', /json/)
        .expect(401, (err, res) => {
          if (err) return done(err);
          expect(res.body.message).toBe('Wrong email or password!');
          return done();
        });
    });
    it('should return an error when no password is passed', (done) => {
      request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          email: validUserExample.email,
        })
        .expect('Content-Type', /json/)
        .expect(422, (err, res) => {
          if (err) return done(err);
          expect(res.body.errors[0].msg).toBe('Password cannot be empty!');

          return done();
        });
    });
    it('should return an error when no email is passed', (done) => {
      request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
          password: validUserExample.password,
        })
        .expect('Content-Type', /json/)
        .expect(422, (err, res) => {
          if (err) return done(err);
          expect(
            res.body.errors.find((error) => error.param === 'email')
          ).toBeDefined();
          return done();
        });
    });
    describe('GET /api/user/profile', () => {
      it('should return an error if there is no authenticated user', (done) => {
        request(app)
          .get('/api/user/profile')
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401, (err, res) => {
            if (err) return done(err);
            expect(res.body.message).toBe(
              'Invalid Token: No authorization token was found'
            );
            return done();
          });
      });
      it('should return user information if there is an authenticated user', (done) => {
        request(app)
          .get('/api/user/profile')
          .set('Content-Type', 'application/json')
          .set('Cookie', jwtToken)
          .expect('Content-Type', /json/)
          .expect(200, (err, res) => {
            if (err) return done(err);
            expect(res.body).toEqual(
              expect.objectContaining({
                email: expect.any(String),
              })
            );

            return done();
          });
      });
    });
  });
});
