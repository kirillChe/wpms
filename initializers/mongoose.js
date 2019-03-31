module.exports = (projectRoot, dbConfig) => {

  const mongoose = require('mongoose');

  return new Promise((resolve, reject) => {

    let connectionString = `mongodb://${dbConfig.username}:${dbConfig.password}` +
      `@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}` +
      `?authSource=admin`;

    let options = {
      useNewUrlParser: true
    };
    mongoose.set('debug', true);//dbConfig.debug || false);
    mongoose.connect(connectionString, options);
    const connection = mongoose.connection;
    connection.on('error', reject);
    connection.once('open', () => {
      console.log('connected to mongodb', connectionString);
      resolve(mongoose);
    });
  });
};
