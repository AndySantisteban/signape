/* This code exports an object with a `PORT` property that is either set to the value of the `PORT`
environment variable or 5000 if the environment variable is not set. This object can be imported and
used in other parts of the code. */
module.exports = {
  PORT: process.env.PORT || 5000,
};
