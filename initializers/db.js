'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

module.exports = (projectRoot, config) => {

  config.operatorsAliases = false;
  config.logging = !!process.env.DEBUG ? console.log : false;

  let sequelize = new Sequelize(config.database, config.username, config.password, config);

  const db = {
    sequelize,
    Sequelize,
    models: {},
  };

  fs
    .readdirSync(`${projectRoot}/db/models`)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      const model = sequelize['import'](path.join(`${projectRoot}/db/models`, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};
