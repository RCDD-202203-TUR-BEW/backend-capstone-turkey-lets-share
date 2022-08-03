const generateUniqeUsername = (email) =>
  `${email.split('@')[0]}_${new Date().valueOf()}`;

module.exports = { generateUniqeUsername };
