const config = require('../app/config.js');

export default {
  'GET /config.js': (_, res) => {
    const configJS = `window.g_config = ${JSON.stringify(config)}`;
    res.send(configJS);
  },
};
