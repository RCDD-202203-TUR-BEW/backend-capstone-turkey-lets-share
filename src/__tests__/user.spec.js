/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable node/no-unpublished-require */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const UserModel = require('../models/user');
const connectDatabase = require('../db/connection');

const createUser = {
  firstName: 'adnan',
  lastName: 'khaldar',
  email: 'adnan@outlook.com',
  username: 'adnan',
  provider: 'Local',
  providerId: 'Local',
  passwordHash: '$2b$10$R5NUgaHK51jYdi59ncmwue/lorlCHturbAmFxJ02cS38eumzNSx7O',
};

let token;
let validUserId;
const invalidUserId = '62ee5c280262c62f56124dfd';

beforeAll(async () => {
  connectDatabase();
  const newUser = await UserModel.create(createUser);
  validUserId = newUser._id;
});

describe('GET /api/user/:id', () => {
  it('should return a token to be used in the next tests ', (done) => {
    supertest(app)
      .post('/api/auth/login')
      .send({ email: createUser.email, password: 'Qwerty-123' })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res.status).toBe(201);
        token = res.headers['set-cookie'][0].split(';')[0];
        done();
      });
  });

  it('should return a single user', (done) => {
    supertest(app)
      .get(`/api/user/${validUserId}`)
      .set('Cookie', token)

      .expect('Content-Type', /json/)
      .expect(200, (err, res) => {
        if (err) return done(err);

        expect(res.body).toHaveProperty('donated');
        expect(res.body.username).toBe(createUser.username);
        return done();
      });
  });

  it('should return "User not found"', (done) => {
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
