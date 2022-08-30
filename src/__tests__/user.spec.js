/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable node/no-unpublished-require */
const supertest = require('supertest');
const app = require('../app');
const UserModel = require('../models/user');
const connectDatabase = require('../db/connection');

const createCurrentUser = {
  firstName: 'adnan',
  lastName: 'khaldar',
  email: 'adnan0@outlook.com',
  username: 'adnan0',
  provider: 'Local',
  providerId: 'Local',
  passwordHash: '$2b$10$R5NUgaHK51jYdi59ncmwue/lorlCHturbAmFxJ02cS38eumzNSx7O',
};

const createRandomUser = {
  firstName: 'john',
  lastName: 'doe',
  email: 'john-doe@outlook.co.uk',
  username: 'john-doe',
  provider: 'Local',
  providerId: 'Local',
};

let token;
let currentUserId;
let validUserId;
const invalidUserId = '62ee5c280262c62f56124dfd';

beforeAll(async () => {
  connectDatabase();
  const newUser0 = await UserModel.create(createCurrentUser);
  const newUser1 = await UserModel.create(createRandomUser);

  currentUserId = newUser0._id;
  validUserId = newUser1._id;
});

describe('GET /api/user/:id', () => {
  it('should return a token when correct user is logged in', (done) => {
    supertest(app)
      .post('/api/auth/login')
      .send({
        usernameOrEmail: createCurrentUser.email,
        password: 'Qwerty-123',
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(201);
        token = res.headers['set-cookie'][0].split(';')[0];
        return done();
      });
  });

  it("should redirect to profile when current user's id is given", (done) => {
    supertest(app)
      .get(`/api/user/${currentUserId}`)
      .set('Cookie', token)

      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);

        expect(res.body.message).toBe('Redirecting to profile...');
        return done();
      });
  });

  it('should return a single user when a valid id is given', (done) => {
    supertest(app)
      .get(`/api/user/${validUserId}`)
      .set('Cookie', token)

      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty('donated');
        expect(res.body.username).toBe(createRandomUser.username);
        return done();
      });
  });

  it('should return "User not found" when an invalid id is given', (done) => {
    supertest(app)
      .get(`/api/user/${invalidUserId}`)
      .set('Cookie', token)

      .expect('Content-Type', /json/)
      .expect(404, (err, res) => {
        if (err) return done(err);

        expect(res.body.message).toBe('User not found');
        return done();
      });
  });
});
