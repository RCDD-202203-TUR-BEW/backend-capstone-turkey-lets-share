/* eslint-disable no-console */
/* eslint-disable no-continue */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable no-return-await */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/order */
/* eslint-disable node/no-unpublished-require */
const mongoose = require('mongoose');
const http = require('node:http');
const https = require('node:https');
const monkeypatch = require('monkeypatch');
const supertest = require('supertest');
const app = require('../app');
const req = require('supertest')(app);
const UserModel = require('../models/user');
const constants = require('../lib/constants');
const connectDatabase = require('../db/connection');

const cookiesAgent = supertest.agent(app);

const mockUser = {
  sub: '12345678',
  name: 'Nilay Aydin',
  given_name: 'Nilay',
  family_name: 'Aydin',
  picture: 'https://lh3.googleusercontent.com/a-/AOh1',
  email: 'nilay.aydin@gmail.com',
  email_verified: true,
  locale: 'en-GB',
};
const validUserExample = {
  email: 'amjad@gmail.com',
  password: 'Nilay-123',
};

beforeAll(async () => {
  await connectDatabase();
  await UserModel.findOneAndDelete({ email: 'john@doe.co.uk' });
  await UserModel.create({
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

afterAll(async (drop = false) => {
  await UserModel.deleteMany({});
  drop && (await mongoose.connection.dropDatabase());
  await mongoose.disconnect();
  await mongoose.connection.close();
});

let redirectUri = null;
let jwtToken = null;

describe('AUTH TESTS', () => {
  describe('POST /api/auth/register', () => {
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

    it('should register users with correct validation', (done) => {
      supertest(app)
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

    it('should not register users if username/email is already taken', (done) => {
      supertest(app)
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

    it('should not pass user to the controller when validation is not passed', (done) => {
      supertest(app)
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
  });

  describe('POST /api/auth/logout', () => {
    it('should log user out', (done) => {
      supertest(app)
        .post('/api/auth/logout')
        .expect(401, (err, res) => {
          if (err) return done(err);
          expect(res.status).toBe(401);
          expect(res.body.message).toBe(
            'Invalid Token: No authorization token was found'
          );
          return done();
        });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return a token in a cookie and success message ', (done) => {
      req
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
      req
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
      req
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
      req
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
      req
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
        req
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
        req
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

describe('Google Auth Endpoints', () => {
  describe('GET /api/auth/google', () => {
    it('Redirects to google authorization page', (done) => {
      req
        .get('/api/auth/google')
        .expect(302)
        .expect('location', /google\.com/)
        .end(done);
    });

    it('Redirects with correct scope and credentials', async () => {
      const res = await req.get('/api/auth/google');
      const location = res.header.location;

      expect(location).not.toBeNull();

      const uri = new URL(location);
      const scope = uri.searchParams.get('scope')?.split(' ') ?? [];
      const redirectTo = uri.searchParams.get('redirect_uri') ?? '';
      const client_id = uri.searchParams.get('client_id') ?? '';

      expect(scope).toEqual(
        expect.arrayContaining(['openid', 'email', 'profile'])
      );
      expect(client_id.length).toBeGreaterThan(10);

      if (redirectTo) redirectUri = new URL(redirectTo);
    });
  });

  describe(`GET REDIRECT_URI`, () => {
    it('Redirects to google sign in page without cookie for incorrect credentials', async () => {
      expect(redirectUri).not.toBeNull();
      const res = await req.get(redirectUri.pathname);
      expect(res.status).toBe(302);
      expect(res.header['set-cookie']).not.toBeDefined();
    });

    it('Redirects to the profile page with a valid JWT cookie for correct credentials', async () => {
      expect(redirectUri).not.toBeNull();

      const res = await runInPatchedServer(
        async () => await cookiesAgent.get(getLoginURL(redirectUri.pathname))
      );
      expect(res.status).toBe(302);
      expect(res.header['set-cookie']).toBeDefined();

      const [cookies] = parseCookies(res.header['set-cookie']);

      const auth_cookie = getJWTCookie(cookies);

      const iat = auth_cookie.iat;

      expect(iat).toBeLessThanOrEqual(Date.now() / 1000);

      const expected = {
        email: mockUser.email,
        providerId: `google-${mockUser.sub}`,
        exp: iat + 14 * 24 * 3600,
        iat: expect.any(Number),
      };

      expect(auth_cookie).toEqual(expect.objectContaining(expected));
    });
  });
});

async function runInPatchedServer(cb) {
  const undo = patch__google_request({
    [`http://127.0.0.1/token`]: (path) => path.endsWith('token'),
    [`http://127.0.0.1/userinfo`]: (path) => path.endsWith('userinfo'),
  });

  let shutdownServer = runTestServer();

  const ret = await cb();

  shutdownServer();
  undo();

  return ret;
}

function patch__google_request(redirects, debug = false) {
  monkeypatch(https, 'request', (orig, opts, cb) => {
    const { host, path } = opts;

    if (/google[a-z0-9]*\.com/.test(host)) {
      if (debug)
        console.log(
          'Intercepted google call to: ',
          opts.method ?? 'GET',
          opts.host,
          opts.path
        );

      for (let url of Object.keys(redirects)) {
        const matcher = redirects[url];
        url = new URL(url);
        if (matcher(path.split('?')[0])) {
          if (debug) console.log('Redirecting to test server: ', url.href);
          opts.host = url.host;
          opts.port = 5005;
          opts.path = url.pathname;
          opts.headers.Host = url.origin;

          return http.request(opts, cb);
        }
      }
    }
    return orig(opts, cb);
  });

  return () => {
    https.request.unpatch();
  };
}

function getLoginURL(base) {
  const params = Object.entries({
    code: 'TEST_CODE',
    scope: 'email profile openid',
  }).reduce((a, p) => {
    a.append(...p);
    return a;
  }, new URLSearchParams());

  return `${base}?${params.toString()}`;
}

// This is a testing server that
// serves google identical profile and tokens
function runTestServer() {
  const app = require('express')();
  const token = {
    access_token: 'TEST_ACCESS_TOKEN',
  };

  app.get('/token', (req, res) => {
    res.json(token);
  });

  app.post('/token', (req, res) => {
    res.json(token);
  });

  app.get('/userinfo', (req, res) => {
    res.json(mockUser);
  });

  // eslint-disable-next-line prettier/prettier
  const server = app.listen(5005, () => {});

  return async () => await server.close();
}

// receives cookies object {name: value}
function getJWTCookie(cookies) {
  const entries = Object.entries(cookies);

  for (let [, value] of entries) {
    try {
      value = parseJWTCookie(value);
      return value;
    } catch (err) {
      continue;
    }
  }
}
function parseJWTCookie(value) {
  if (typeof value !== 'string') {
    return undefined;
  }
  const { SECRET_KEY } = process.env;

  const { decryptAesGcm } = require('encrypt-cookie');
  const jwt = require('jsonwebtoken');
  value = decryptAesGcm(value, SECRET_KEY) || value;

  if (value.substr(0, 2) === 's:') {
    // Unsign cookie
    const { unsign } = require('cookie-signature');
    value = unsign(value, SECRET_KEY);
  }

  const decoded = jwt.verify(value, SECRET_KEY);
  return decoded;
}

// parses set-cookie array
function parseCookies(cookies) {
  const parser = require('cookie');
  const obj = {};
  cookies.forEach((c) => {
    try {
      c = parser.parse(c.split(/; */)[0]);
      Object.assign(obj, c);
    } catch (err) {
      console.log(err);
    }
  });
  return [
    obj,
    Object.entries(obj)
      .map((e) => parser.serialize(...e))
      .join('; '),
  ];
}
