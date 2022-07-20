const mongoose = require('mongoose');

const url = process.env.DB_URL;

const connectToMongo = () => {
  mongoose.connect(url, { useNewUrlParser: true });

  const db = mongoose.connection;

  db.once('open', () => {
    console.log('Database connected: ', url);
  });

  db.on('error', (err) => {
    console.error('Database connection error: ', err);
  });
};

module.exports = connectToMongo;
