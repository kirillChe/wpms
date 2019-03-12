/**
 * IPC - Inter-Process Communication component
 *
 * @type {request}
 */
const request = require('request-promise');
request.debug = process.env.DEBUG || false;

module.exports = async () => {

  return {
    /**
     *
     * @param serviceName
     * @param wpmsCtx
     * @param options
     * @return {Promise.<*>}
     */
    callService: async (serviceName, wpmsCtx, options) => {
      const ports = {
        template: 4000,
        site: 3000,
        renderer: 2000
      };
      let port = ports[serviceName];

      let url = `http://localhost:${port}${options.url}`;

      if (options.query) {
        url += '?' + Object.keys(options.query).map(key => key + '=' + encodeURIComponent(options.query[key])).join('&');
      }

      let requestOptions = {
        method: options.method,
        url,
        headers: {
          'x-wpms-ctx': JSON.stringify(wpmsCtx)
        },
        json: true,
        body: options.body || {}
      };
      return request(requestOptions);
    }
  };
};
