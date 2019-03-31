const fs = require('fs');
const async = require('async');
module.exports = (app, projectRoot) => {
  return new Promise((resolve, reject) => {

    if (!fs.existsSync(`${projectRoot}/boot`))
      return resolve([]);

    const scripts = [];
    fs
      .readdirSync(`${projectRoot}/boot`)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
      })
      .forEach(file => {
        scripts.push(require(`${projectRoot}/boot/${file}`));
      });

    async.eachSeries(scripts, async script => script(app), err => {
      if (err)
        return reject(err);
      resolve();
    });
  });
};
