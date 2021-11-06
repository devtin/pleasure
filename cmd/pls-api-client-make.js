#!/usr/bin/env node

const { outputFile } = require('fs-extra')
const { jsDirIntoJson } = require('js-dir-into-json')
const { startCase } = require('lodash')
const path = require('path')
const {
  schemaAsTsClass,
  schemaAsTsInterface,
  util
} = require('duckfficer-ts-descriptor')
const { DuckStorage } = require('duck-api')

const { Duckfficer: { Schema } } = DuckStorage

const config = require('../lib/config.js')

const upperCamelCase = (str) => startCase(str).replace(/[\s]/g, '')

const gatewayToTsDescriptor = (domain, domainName) => {
  const rack = Schema.ensureSchema(domain.model.schema)
  const crudMethods = {
    create: {
      input: rack,
      output: rack,
    }
  }

  return schemaAsTsClass({
    name: domainName,
    schema: {},
    type: 'Object',
    _methods: {
      ...domain.methods,
      ...crudMethods
    },
    children: []
  })
}

const makeClient = async () => {
  const domainObj = await jsDirIntoJson(config.api.domain)
  const description = []

  Object.entries(domainObj).forEach(([domainName, domainValue]) => {
    description.push(gatewayToTsDescriptor(domainValue, upperCamelCase(`${domainName}Gateway`)))
    description.push(schemaAsTsClass(Schema.ensureSchema(domainValue.model.schema), upperCamelCase(domainName)))
  })
  await outputFile(path.join(config.client.output, 'index.d.ts'), description.join('\n'))
}

makeClient()

// todo:
//   - read domain, routes and plugins
//   - create specs for each entity
//   - create events and errors descriptors
//   - export client
