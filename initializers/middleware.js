const _ = require('lodash');
const R = require('ramda');
const fs = require('fs');

const wpmsMiddlewares = require('require-all')({
  dirname: __dirname + '/../middleware',
  map: _.camelCase
});

module.exports = (app, projectRoot) => {
  const phases = [
    'initial:before',
    'initial',
    'initial:after',
    'parse:before',
    'parse',
    'parse:after',
    'routes:before',
    'routes',
    'routes:after',
    'final:before',
    'final',
    'final:after'
  ];

  let middlewareConfig = {};
  if (fs.existsSync(`${projectRoot}/configs/middleware.json`)) {
    middlewareConfig = require(`${projectRoot}/configs/middleware.json`);
  }

  phases.forEach(phase => {
    if (phase === 'routes' && fs.existsSync(`${projectRoot}/configs/routes.js`)) {
      require(app.projectRoot + '/configs/routes')(app);
    }

    let middlewares = R.keys(middlewareConfig[phase]);
    middlewares.forEach(label => {

      let [module, initFunction] = label.split('#');

      let options = middlewareConfig[phase][label];

      if (module === 'wpms' || module.indexOf('./middleware') > -1) {

        let middleware = module === 'wpms' ?
          wpmsMiddlewares[initFunction] : require(projectRoot + module.replace('./', '/'));

        options = JSON.stringify(options) === '{}' ? null : options;
        if (options)
          app.use(middleware(options, app));
        else
          app.use(middleware(app));

      } else {
        // external middleware
        let middleware = require(module);
        app.use(initFunction ? middleware[initFunction](options) : middleware(options));
      }

    });
  });
};
