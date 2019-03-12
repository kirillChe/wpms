module.exports = (app) => {
  // load routes
  require(app.projectRoot + '/api/routes')(app);

  return (req, res, next) => {
    next();
  };
};
