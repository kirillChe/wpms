'use strict';

module.exports = async (projectRoot, dbConfig) => {

  const fs = require('fs');
  const path = require('path');
  const Sequelize = require('sequelize');

  dbConfig.operatorsAliases = false;
  dbConfig.logging = process.env.DEBUG ? console.log : false;

  let sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

  const db = {};

  fs
    .readdirSync(`${projectRoot}/models`)
    .filter(file => {
      return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      const model = sequelize['import'](path.join(`${projectRoot}/models`, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
};
