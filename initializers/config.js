module.exports = async () => {

  // @todo load configs from config storage

  return {
    db: {
      username: 'root',
      password: 'root',
      database: 'tests',
      host: 'localhost',
      dialect: 'mysql',
      operatorsAliases: false
    }
  };
};
