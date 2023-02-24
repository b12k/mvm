#!/usr/bin/env node
import { program } from 'commander';
import { resolve } from 'node:path';

import { getRepoRootPath, readLocalPackageJson, logJson } from './utils';
import { UpdateConfig, update } from './update';

const args = program
  .option(
    '-n, --name <name>',
    'dependency / package name (like in package.json)',
  )
  .option(
    '-v, --version <version>',
    'dependency / package version (like in package.json)',
  )
  .option('-r, --root <path>', 'absolute path to the monorepo root directory')
  .option('-v, --verbose', 'enable debug output')
  .helpOption('-h, --help', 'display this help')
  .parse()
  .opts<Partial<UpdateConfig> & { verbose: boolean }>();

const config: UpdateConfig = {
  name: args.name || readLocalPackageJson().name,
  root: (args.root && resolve(args.root)) || getRepoRootPath(),
  version: args.version || readLocalPackageJson().version,
  log: args.verbose ? logJson : undefined,
};

update(config);
