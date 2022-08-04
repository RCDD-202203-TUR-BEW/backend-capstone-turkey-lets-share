/* eslint-disable import/order */
/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const app = require('../app');
const UserModel = require('../models/user');
const constants = require('../lib/constants');
const mongoose = require('mongoose');
const connectDatabase = require('../db/connection');

describe('POST /api/auth/register && POST /api/auth/logout', () => {
  beforeAll(async () => {
    connectDatabase();
    await UserModel.findOneAndDelete({ email: 'john@doe.co.uk' });
  });

  afterAll(async () => {
    await UserModel.findOneAndDelete({ email: 'john@doe.co.uk' });
    await mongoose.disconnect();
  });

  const invalidUserInfo = {
    firstName: 'John',
    lastName: '',
    email: 'john@doe.fake.domain.com',
    phoneNumber: '+44 0123456789876543210',
    age: 21,
    gender: 'Male',
    nationality: 'Other',
    refugee: false,
    password0: 'qwerty-123',
    password1: 'Qwerty-123456789',
  };

  const validUserInfo = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@doe.co.uk',
    phoneNumber: '000123456789',
    age: 21,
    gender: 'Male',
    nationality: 'Other',
    refugee: false,
    password0: 'Qwerty-123',
    password1: 'Qwerty-123',
  };

  it('POST /api/auth/register should register users with correct validation', (done) => {
    request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(validUserInfo)
      .expect('Content-Type', /json/)
      .expect(201, (err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('username');
        return done();
      });
  });

  it('POST /api/auth/register should not register users if username/email is already taken', (done) => {
    request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(validUserInfo)
      .expect('Content-Type', /json/)
      .expect(400, (err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Email is already taken');
        return done();
      });
  });

  it('POST /api/auth/register middleware should not pass user to the controller when validation is not passed', (done) => {
    request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send(invalidUserInfo)
      .expect(400, (err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(400);
        expect(res.body.error[0]).toBe('Password fields do not match');
        expect(res.body.error[1]).toBe(constants.PASSWORD_ERROR);
        expect(res.body.error[2]).toBe('Name fields can not be empty');
        expect(res.body.error[3]).toBe('Invalid email format');
        expect(res.body.error[4]).toBe(constants.PHONE_NUMBER_ERROR);
        return done();
      });
  });

  it('POST /api/auth/logout', (done) => {
    request(app)
      .post('/api/auth/logout')
      .expect(200, (err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Logged out successfully');
        return done();
      });
  });
});
