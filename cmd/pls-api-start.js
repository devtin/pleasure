const { apiSetup } = require('duck-api');
const Koa = require('koa');

const config = require('../lib/config.js')

console.log(JSON.stringify({ config }, null, 2))

async function start () {
  const app = new Koa()

  app.keys = config.api.cookies.keys;

  const server = app.listen(config.api.port, config.api.host)

  await apiSetup({
    app,
    server,
    routesDir: config.api.routes,
    servicesDir: config.api.services,
    domainDir: config.api.domain,
    gatewaysDir: config.api.gateways,
    domainPrefix: config.api.domainPrefix,
    servicesPrefix: config.api.servicesPrefix,
    gatewaysPrefix: config.api.gatewaysPrefix,
    pluginsPrefix: config.api.pluginsPrefix,
    duckStorage: config.api.duckStorage,
    pluginsDir: config.api.pluginsDir,
    di: config.api.di,
    withSwagger: config.api.withSwagger
  }, {
    duckStorageSettings: config.api.duckStorageSettings,
    plugins: config.api.plugins,
    socketIOSettings: config.api.socketIOSettings,
    customErrorHandling: config.api.customErrorHandling,
  })

  console.log('listo')
}

start()
