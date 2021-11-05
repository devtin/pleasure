const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');
const { isPlainObject } = require('is-plain-object');

dotenv.config();

const getEnvValue = (envName) => {
  const prefix = process.env.PLEASURE_ENV_PREFIX || ''
  return process.env[`${prefix}${envName}`]
}

const getProjectPath = () => {
  return getEnvValue('PROJECT_PATH') || process.cwd()
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

module.exports = merge({
  name: getProjectName(),
  api: {
    domain: getEnvValue('DOMAIN_PATH') || path.join(getProjectPath(), 'app/domain'),
    services: getEnvValue('SERVICES_PATH') || path.join(getProjectPath(), 'app/services'),
    gateways: getEnvValue('GATEWAYS_PATH') || path.join(getProjectPath(), 'app/gateways'),
    routes: getEnvValue('ROUTES_PATH') || path.join(getProjectPath(), 'app/routes'),
    plugins: getEnvValue('PLUGINS_PATH') || path.join(getProjectPath(), 'app/plugins'),
    domainPrefix: getEnvValue('DOMAIN_PREFIX') || '/domain',
    servicesPrefix: getEnvValue('SERVICES_PREFIX') || '/services',
    gatewaysPrefix: getEnvValue('GATEWAYS_PREFIX') || '/gateways',
    routesPrefix: getEnvValue('ROUTES_PREFIX') || '/routes',
    pluginsPrefix: getEnvValue('PLUGINS_PREFIX') || '/plugins',
    host: getEnvValue('API_HOST') || `0.0.0.0`,
    port: getEnvValue('API_PORT') || 3000,
    mongodbUri: getEnvValue('MONGODB_URI') || `mongodb://localhost:27017`,
    cookies: {
      keys: [] // for signed cookies
    },
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
