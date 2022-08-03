/* eslint-disable arrow-body-style */
const generateUniqeUsername = (email) => {
  return `${email.split('@')[0]}_${new Date().valueOf()}`;
};

module.exports = { generateUniqeUsername };
