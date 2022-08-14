/* eslint-disable no-console */
const express = require('express');
require('dotenv').config();

const cookieParser = require('cookie-parser');
const { expressjwt: jwt } = require('express-jwt');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const bodyParser = require('body-parser');
const connectToMongo = require('./db/connection');
const authorize = require('./middleware/guard');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const constants = require('./lib/constants');

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

const { PUBLIC_AUTH_ROUTES } = constants;

const publicAuthPaths = PUBLIC_AUTH_ROUTES.map(({ path }) => path);

app.use(
  '/api',
  jwt({
    secret: process.env.SECRET_KEY,
    algorithms: ['HS256'],
    getToken: (req) => req.signedCookies.token ?? req.cookies.token,

    requestProperty: 'user',
  }).unless({
    path: publicAuthPaths,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// DYNAMIC MIDDLEWARE
// app.use(authorize);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: "Let's Share API with Swagger",
    version: '0.1.0',
    description: "Let's Share API documentation with Swagger",
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  host: 'localhost:3000', // the host or url of the app
};
// options for the swagger docs
const options = {
  definition: swaggerDefinition,
  apis: ['./src/docs/**/*.yaml'],
};
// initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// use swagger-Ui-express for app documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ message: "Hello Let's Share!" });
});

// If I delete the next, the code is not working. Why?
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({
      error: true,
      message: `Invalid Token: ${err.message}`,
    });
  } else {
    res.status(500).json({
      error: true,
      message: 'Internal server error occured',
    });
  }
}

app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}`);
    connectToMongo();
  });
}

module.exports = app;
