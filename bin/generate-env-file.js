const wpms = require('../../wpms2');
const fs = require('fs');

wpms.loadConfigs().then((configs) => {
  fs.writeFile('config/env.json', JSON.stringify(configs, null, 2), (err) => {
    if (err) throw err;
    console.log('done!'); // eslint-disable-line no-console
  });
});
