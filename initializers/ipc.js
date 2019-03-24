/**
 * IPC - Inter-Process Communication component
 *
 * @type {request}
 */
const request = require('request-promise');
// request.debug = process.env.DEBUG || false;

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

      if (options.url[0] === '/')
        options.url = options.url.substr(1);

      let url = `http://${serviceName}/${options.url}`;
      if (options.query) {
        url += '?' + Object.keys(options.query).map(key => key + '=' + encodeURIComponent(options.query[key])).join('&');
      }
      if (process.env.DEBUG)
        console.log(decodeURIComponent(url));

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
