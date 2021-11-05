#!/usr/bin/env node

const { program } = require('commander');

program
  .version('0.1.0')
  .command('api [cmd]', 'api commands')

program.parse(process.argv)
