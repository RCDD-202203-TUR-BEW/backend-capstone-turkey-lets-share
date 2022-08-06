/* eslint-disable node/no-unpublished-require */
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const UserModel = require('../models/user');
const connectDatabase = require('../db/connection');

const validUserId = '62eb038c20b4f5b0bd8c7676';
const invalidUserId = '62ee5c280262c62f56124dfd';

beforeAll(async () => {
  connectDatabase();
});

afterAll(async () => {
  await UserModel.deleteMany({});
  await mongoose.disconnect();
  await mongoose.connection.close();
});

describe('GET /api/user/:id', () => {
  it('should return a single user', (done) => {
    supertest(app)
      .get(`/api/user/${validUserId}`)

      .expect('Content-Type', /json/)
      .expect(401, (err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(401);
        expect(res.body.error).toBe(true);
        expect(res.body.message).toBe(
          'Invalid Token: No authorization token was found'
        );
        return done();
      });
  });

  it('should return "User not found"', (done) => {
    supertest(app)
      .get(`/api/user/${invalidUserId}`)

      .expect('Content-Type', /json/)
      .expect(401, (err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(401);
        expect(res.body.error).toBe(true);
        expect(res.body.message).toBe(
          'Invalid Token: No authorization token was found'
        );
        return done();
      });
  });
});
