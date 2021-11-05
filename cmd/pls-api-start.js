const { apiSetup } = require('duck-api');
const DuckStorageMongo = require('duck-storage-mongodb');
const Koa = require('koa');

const config = require('../lib/config.js')

const getDbName = () => {
  // todo: grab name from package.json
  const withPrefix = (dbName) => (`${config.name}-${dbName}`)
  if (process.env.NODE_ENV === 'production') {
    return withPrefix('production')
  }

  if (process.env.NODE_ENV === 'test') {
    return withPrefix('test')
  }

  return withPrefix('staging')
}

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
    duckStorageSettings: {
      plugins: [{
        name: DuckStorageMongo.name,
        handler: DuckStorageMongo.handler({
          credentials: config.api.mongodbUri,
          dbName: getDbName()
        })
      }],
      setupIpc: false
    }
  })

  console.log('listo')
}

start()
