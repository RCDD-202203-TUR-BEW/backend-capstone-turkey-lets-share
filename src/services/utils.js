/* eslint-disable arrow-body-style */
const generateUniqeUsername = (email) => {
  return `${email.split('@')[0]}_${new Date().valueOf()}`;
};

// If I delete the next, the code is not working. Why?
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

module.exports = { generateUniqeUsername, errorHandler };
