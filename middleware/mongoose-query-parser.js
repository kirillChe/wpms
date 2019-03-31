module.exports = () => {
  // const R = require('ramda');

  return (req, res, next) => {
    if (req.method !== 'GET')
      return next();

    if (req.query.filter) {
      req.query.filter = JSON.parse(req.query.filter);
    }

    next();
  };

};
