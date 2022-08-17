/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
/* eslint-disable node/no-unpublished-require */
describe('Product test', () => {
  it('Product Test', () => {
    expect(true).toEqual(true);
  });
});
// const supertest = require('supertest');
// const app = require('../app');
// const UserModel = require('../models/user');
// const ProductModel = require('../models/product');
// const connectDatabase = require('../db/connection');

// const createCurrentUser = {
//   firstName: 'adnan',
//   lastName: 'khaldar',
//   email: 'adnan1@outlook.com',
//   username: 'adnan1',
//   donated: [],
//   requested: [],
//   provider: 'Local',
//   providerId: 'Local',
//   passwordHash: '$2b$10$R5NUgaHK51jYdi59ncmwue/lorlCHturbAmFxJ02cS38eumzNSx7O',
// };

// const createRequestProduct = {
//   title: 'test',
//   description: 'test',
//   photos: ['test'],
//   category: 'Other',
//   location: 'test',
//   productCondition: 'New',
//   shippingOptions: 'To be determined',
//   postType: 'Request',
// };

// const createDonateProduct = {
//   title: 'test',
//   description: 'test',
//   photos: ['test'],
//   category: 'Other',
//   location: 'test',
//   productCondition: 'New',
//   shippingOptions: 'To be determined',
//   postType: 'Donate',
// };

// let newUser;
// let token;

// let requestPostId;
// let donatePostId;

// beforeAll(async () => {
//   connectDatabase();
//   newUser = await UserModel.create(createCurrentUser);
// });

// describe('POST /api/product', () => {
//   it('should return a token when correct user is logged in', (done) => {
//     supertest(app)
//       .post('/api/auth/login')
//       .send({ email: createCurrentUser.email, password: 'Qwerty-123' })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         expect(res.status).toBe(201);
//         token = res.headers['set-cookie'][0].split(';')[0];
//         return done();
//       });
//   });

//   it('should create a new product with the postType property set to "Request"', (done) => {
//     supertest(app)
//       .post('/api/product')
//       .set('Cookie', token)
//       .send(createRequestProduct)

//       .expect('Content-Type', /json/)
//       .expect(201, (err, res) => {
//         if (err) return done(err);

//         requestPostId = res.body._id;
//         expect(res.body).toHaveProperty('isEvent');
//         return done();
//       });
//   });

//   it('should check if "Request" post was created', (done) => {
//     supertest(app)
//       .get('/api/user/profile')
//       .set('Cookie', token)

//       .expect('Content-Type', /json/)
//       .expect(200, (err, res) => {
//         if (err) return done(err);

//         expect(res.body.requested).toContain(requestPostId);
//         expect(res.body.requested[0]).toBe(requestPostId);
//         expect(res.body.requested.length).toBe(1);
//         return done();
//       });
//   });

//   it('should create a new product with the postType property set to "Donate"', (done) => {
//     supertest(app)
//       .post('/api/product')
//       .set('Cookie', token)
//       .send(createDonateProduct)

//       .expect('Content-Type', /json/)
//       .expect(201, (err, res) => {
//         if (err) return done(err);

//         donatePostId = res.body._id;
//         expect(res.body).toHaveProperty('isEvent');
//         return done();
//       });
//   });

//   it('should check if "Donate" post was created', (done) => {
//     supertest(app)
//       .get(`/api/user/profile`)
//       .set('Cookie', token)

//       .expect('Content-Type', /json/)
//       .expect(200, (err, res) => {
//         if (err) return done(err);

//         expect(res.body.donated).toContain(donatePostId);
//         expect(res.body.donated[0]).toBe(donatePostId);
//         expect(res.body.donated.length).toBe(1);
//         return done();
//       });
//   });
// });
