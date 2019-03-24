const R = require('ramda');
const Op = require('sequelize').Op;

module.exports = () => (req, res, next) => {
  if (req.method !== 'GET')
    return next();

  if (req.query.filter) {
    req.query.filter = parse(JSON.parse(req.query.filter));
  }

  next();
};

function parse(root) {
  let parsed;
  if (Array.isArray(root)) {
    parsed = [];
    root.forEach((node) => parsed.push(parse(node)));
  } else if (typeof root === 'object') {
    parsed = {};
    let keys = R.keys(root);
    keys.forEach(key => {
      let value = root[key];
      switch (key) {
        case 'or':
          key = Op.or;
          break;
        case 'in':
          key = Op.in;
          break;
      }
      parsed[key] = parse(value);
    });
  } else {
    parsed = root;
  }
  return parsed;
}
