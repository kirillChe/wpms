const _ = require('lodash');
const fs = require('fs');
const express = require('express');

// load middlewares
const middlewares = require('require-all')({
  dirname: __dirname + '/middleware',
  map: _.camelCase
});

const wpms = _.assign({

  createApp: () => express(),
  /**
   * @param app
   * @param {String} projectRoot  Directory to use when loading JSON and JavaScript files.
   * @return {Promise.<void>}
   */
  boot: async (app, projectRoot) => {

    // load configs
    wpms.configs = await require('./initializers/config')();

    // configure ipc
    wpms.ipc = await require('./initializers/ipc')();

    if (app) {

      app.projectRoot = projectRoot;
      app.wpms = wpms;

      if (fs.existsSync(`${projectRoot}/db`)) {
        // configure db
        wpms.db = require('./initializers/db')(projectRoot, wpms.configs.db);
      }

      // load middlewares
      require('./initializers/middleware')(app, projectRoot);
    }
  }
}, middlewares);

module.exports = wpms;
