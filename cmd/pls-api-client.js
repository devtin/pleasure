#!/usr/bin/env node

const { program } = require('commander');

program
  .version('0.1.0')
  .command('make', 'builds client')

program.parse(process.argv)
