// eslint-disable-next-line node/no-unpublished-require
const request = require('supertest');
const app = require('../app');
const connectDatabase = require('../db/connection');

beforeAll(async () => {
  await connectDatabase();
});

const validUserExample = {
  email: 'niloaydin@domain.com.tr',
  password: 'Nilay-123',
};

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
          expect(res.body.message).toBe('Wrong username or password!');
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
          expect(res.body.message).toBe('Wrong username or password!');
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
    describe('GET /api/auth/profile', () => {
      it('should return an error if there is no authenticated user', (done) => {
        request(app)
          .get('/api/auth/profile')
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
          .get('/api/auth/profile')
          .set('Content-Type', 'application/json')
          .set('Cookie', jwtToken)
          .expect('Content-Type', /json/)
          .expect(200, (err, res) => {
            // console.log(res.body);
            if (err) return done(err);
            // const expected = {
            //   firstName: expect.any(String),
            //   lastName: expect.any(String),
            //   email: expect.any(String),
            //   username: expect.any(String),
            //   age: expect.any(Number),
            //   gender: expect.any(String),
            //   nationality: expect.any(String),
            //   refugee: expect.any(Boolean),
            //   averageRating: expect.any(Number),
            //   profilePhoto: expect.any(String),
            //   donated: expect.any(Array),
            //   requested: expect.any(Array),
            //   provider: expect.any(String),
            //   providerId: expect.any(String),
            //   passwordHash: expect.any(String),
            //   address: expect.any(Array),
            //   reviews: expect.any(Array),
            //   reports: expect.any(Array),
            // };
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
