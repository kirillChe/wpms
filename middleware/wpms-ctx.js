module.exports = () => (req, res, next) => {
  req.wpmsCtx = {
    requester: {
      id: 12345,
      type: 'user',
      ip: req.ip
    },
    scope: {
      resellerId: 'webs',
      accountId: 1000,
      siteId: 9999
    }
  };
  return next();
};
