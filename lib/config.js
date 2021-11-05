const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');
const { isPlainObject } = require('is-plain-object');
const DuckStorageMongo = require('duck-storage-mongodb')

dotenv.config();

const getEnvValue = (envName) => {
  const prefix = process.env.PLEASURE_ENV_PREFIX || ''
  return process.env[`${prefix}${envName}`]
}

const getProjectPath = () => {
  return getEnvValue('PROJECT_PATH') || process.cwd()
}

const getAppPath = () => {
  return path.resolve(getProjectPath(), getEnvValue('APP_PATH') || 'app')
}

const getProjectName = () => {
  const packageJson = path.join(getProjectPath(), 'package.json')
  if (fs.existsSync(packageJson)) {
    return require(packageJson).name
  }
}

const getLocalConfig = () => {
  const configPath = path.join(getProjectPath(), 'pleasure.config.js');

  if (fs.existsSync(configPath)) {
    return require(configPath)
  }

  return {}
}

const getDbName = () => {
  // todo: grab name from package.json
  const withPrefix = (dbName) => (`${getProjectName()}-${dbName}`)
  if (process.env.NODE_ENV === 'production') {
    return withPrefix('production')
  }

  if (process.env.NODE_ENV === 'test') {
    return withPrefix('test')
  }

  return withPrefix('staging')
}

const mongodbUri = getEnvValue('MONGODB_URI') || `mongodb://localhost:27017`

module.exports = merge({
  name: getProjectName(),
  api: {
    domain: getEnvValue('DOMAIN_PATH') || path.join(getAppPath(), 'domain'),
    services: getEnvValue('SERVICES_PATH') || path.join(getAppPath(), 'services'),
    gateways: getEnvValue('GATEWAYS_PATH') || path.join(getAppPath(), 'gateways'),
    routes: getEnvValue('ROUTES_PATH') || path.join(getAppPath(), 'routes'),
    domainPrefix: getEnvValue('DOMAIN_PREFIX') || '/domain',
    servicesPrefix: getEnvValue('SERVICES_PREFIX') || '/services',
    gatewaysPrefix: getEnvValue('GATEWAYS_PREFIX') || '/gateways',
    routesPrefix: getEnvValue('ROUTES_PREFIX') || '/routes',
    pluginsPrefix: getEnvValue('PLUGINS_PREFIX') || '/plugins',
    host: getEnvValue('API_HOST') || `0.0.0.0`,
    port: getEnvValue('API_PORT') || 3000,
    mongodbUri,
    cookies: {
      keys: [] // for signed cookies
    },
    duckStorageSettings: {
      plugins: [{
        name: DuckStorageMongo.name,
        handler: DuckStorageMongo.handler({
          credentials: mongodbUri,
          dbName: getDbName()
        })
      }],
      setupIpc: false
    },
    socketIOSettings: {},
    plugins: [],
    customErrorHandling: undefined,
    pluginsDir: getEnvValue('PLUGINS_PATH') || path.join(getAppPath(), 'plugins'),
  },
  client: {
    output: getEnvValue('CLIENT_OUTPUT') || path.join(getProjectPath(), 'client'),
    remote: '', // github or npm
    name: `${getProjectName()}-client`,
  }
},
  getLocalConfig(),
  {
    isMergeableObject: isPlainObject
  }
)
