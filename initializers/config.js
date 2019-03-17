const consul = require('consul')({host: 'consul'});

module.exports = async (appName) => {
  return await loadConfigs(appName);
};

function loadConfigs(appName) {
  return new Promise((resolve, reject) => {
    consulGet((err, kv) => {
      if (err)
        return reject(err);
      // KV loaded
      // The kv has the following structure:
      // [
      //  {
      //     Key: 'configs/site/db',
      //     Value: '{"username": "root","password": "root","database": "nova_site","host": "db","dialect": "mysql","operatorsAliases": false}',
      //  },
      //  {
      //    Key: 'configs/template/db',
      //    Value: '{"username": "root","password": "root","database": "nova_template","host": "db","dialect": "mysql","operatorsAliases": false}',
      //  },
      //  {
      //    Key: 'configs/global/systemUrl',
      //    Value: ' {"protocol":"http","host":"localhost","port":"80"}',
      //  }
      // ]
      //
      // we need to convert them to the following:
      // {
      //   "global": {
      //     "systemUrl": {...},
      //     "anotherKey": {...}
      //   },
      //   "db": {...}
      // }
      // The Key looks like 'configs/global/${configName}

      try {
        const configs = {
          global: {}
        };
        kv.forEach(item => {
          let keyArr = item.Key.split('/');
          // 0 => configs
          // 1 => (global|$serviceName)
          // last => $configName
          let type = keyArr[1],
            key = keyArr.pop();
          if (type === 'global') {
            configs.global[key] = JSON.parse(item.Value);
          } else if (type === appName) {
            configs[key] = JSON.parse(item.Value);
          }
        });
        resolve(configs);
      } catch (e) {
        console.log('failed to parse KV', e);
        reject(e);
      }
    });
  });
}

function consulGet(cb) {
  consul.kv.get({
    key: 'configs',
    recurse: true
  }, function (err, kv) {
    if (err) {
      console.log(`kv get failed`, err);
      return cb(err);
    }
    if (!kv) {
      console.log('no configs found in consul KV, waiting 10 sec');
      setTimeout(function () {
        consulGet(cb)
      }, 10000);
    } else {
      return cb(null, kv);
    }
  });
}
