const mongoose = require('mongoose');

const urlDev = process.env.DB_DEV_URL;
const urlTest = process.env.DB_TEST_URL;
const urlProd = process.env.DB_PROD_URL;

let url = urlDev;
if (process.env.IS_JEST) url = urlTest;
if (process.env.NODE_ENV === 'production') url = urlProd;

const connectToMongo = () => {
  mongoose.connect(url, { useNewUrlParser: true });

  const db = mongoose.connection;

  db.once('open', () => {
    console.log('Database connected');
  });

  db.on('error', (err) => {
    console.error('Database connection error: ', err);
  });
};

module.exports = connectToMongo;
