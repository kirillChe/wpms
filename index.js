const _ = require('lodash');
const express = require('express');

// load middlewares
const middlewares = require('require-all')({
  dirname: __dirname + '/middleware',
  map: _.camelCase
});

const wpms = _.assign({
  /**
   *
   * @return {*}
   */
  createApp: () => {
    const app = express();

    app.start = () => {

      if (app.started)
        return;

      // @todo - prettify
      if (!app.ready) {

        app.once('ready', () => {
          // set the port
          const port = process.env.PORT || 80;
          // start the app
          app.listen(port, () => {
            console.log(`Server is running on port ${port}`); // eslint-disable-line no-console
            // emit started event
            app.started = true;
            app.emit('started');
          });
        });
      } else {
        // set the port
        const port = process.env.PORT || 80;
        // start the app
        app.listen(port, () => {
          console.log(`Server is running on port ${port}`); // eslint-disable-line no-console
          // emit started event
          app.started = true;
          app.emit('started');
        });
      }
    };

    return app;
  },
  /**
   * @param app
   * @param {String} projectRoot  Directory to use when loading JSON and JavaScript files.
   * @return {Promise.<void>}
   */
  boot: async (app, projectRoot) => {

    const appName = require(projectRoot + '/../package.json').name;

    // load configs
    wpms.configs = await require('./initializers/config')(appName);

    // configure ipc
    wpms.ipc = await require('./initializers/ipc')();

    if (app) {

      app.projectRoot = projectRoot;
      app.wpms = wpms;

      if (wpms.configs.db) {
        app.db = await require(`./initializers/${wpms.configs.db.connector}`)(projectRoot, wpms.configs.db);
      }

      // load middlewares
      require('./initializers/middleware')(app, projectRoot);

      // load boot scripts
      await require('./initializers/boot-scripts')(app, projectRoot);

      app.ready = true;
      app.emit('ready');
    }
  }
}, middlewares);

module.exports = wpms;
