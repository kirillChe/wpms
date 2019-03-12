module.exports = () => (err, req, res, next) => {
  console.log('-----------------------------');
  console.dir(err, {colors: true, depth: 5});
  console.log('-----------------------------');
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
};
