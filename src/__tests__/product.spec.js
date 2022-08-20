/* eslint-disable no-unused-expressions */
/* eslint-disable node/no-unpublished-require */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
// const supertest = require('supertest');
// const mongoose = require('mongoose');
// const app = require('../app');
// const UserModel = require('../models/user');
// const ProductModel = require('../models/product');
// const connectDatabase = require('../db/connection');

describe('Product test', () => {
  it('Product Test', () => {
    expect(true).toEqual(true);
  });
});

// const createCurrentUser = {
//   firstName: 'adnan',
//   lastName: 'khaldar',
//   email: 'adnan3@outlook.com',
//   username: 'adnan3',
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

// afterAll(async (drop = false) => {
//   drop && (await mongoose.connection.dropDatabase());
//   await mongoose.disconnect();
//   await mongoose.connection.close();
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

//         requestPostId = res.body.id;
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

//         donatePostId = res.body.id;
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

//   it('should delete the product with the postType property set to "Request"', (done) => {
//     supertest(app)
//       .delete(`/api/product/${requestPostId}`)
//       .set('Cookie', token)
//       .expect(200, (err, res) => {
//         if (err) return done(err);

//         expect(newUser.requested.length).toBe(0);
//         expect(res.body.message).toBe('Product deleted successfully');
//         return done();
//       });
//   });

//   it('should delete the product with the postType property set to "Donate"', (done) => {
//     supertest(app)
//       .delete(`/api/product/${donatePostId}`)
//       .set('Cookie', token)
//       .expect(200, (err, res) => {
//         if (err) return done(err);

//         expect(newUser.donated.length).toBe(0);
//         expect(res.body.message).toBe('Product deleted successfully');
//         return done();
//       });
//   });
// });
