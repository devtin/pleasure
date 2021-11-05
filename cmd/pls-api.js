#!/usr/bin/env node

const { program } = require('commander');

program
  .version('0.1.0')
  .command('client', 'client options')
  .command('start', 'starts the api')
  .command('stop', 'stops the api')

program.parse(process.argv)
