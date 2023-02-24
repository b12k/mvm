#!/usr/bin/env node
import { cwd, exit } from 'node:process';
import { resolve } from 'node:path';
import { program } from 'commander';

import { SkipConfig, skip } from './skip';
import { getRepoRootPath, readLocalPackageJson, logJson } from './utils';

const args = program
  .option(
    '-n, --name <name>',
    'dependency / package name (like in package.json)',
  )
  .option(
    '-w, --workspace <path>',
    'absolute path to the monorepo root directory',
  )
  .option(
    '-r, --root <path>',
    'absolute path to the monorepo workspace directory',
  )
  .option('-s, --silent', 'mute output to console')
  .option('-v, --verbose', 'enable debug output')
  .helpOption('-h, --help', 'display this help')
  .parse()
  .opts<Partial<SkipConfig> & { verbose: boolean; silent: boolean }>();

const config: SkipConfig = {
  name: args.name || readLocalPackageJson().name,
  root: (args.root && resolve(args.root)) || getRepoRootPath(),
  workspace: resolve(args.workspace || cwd()),
  log: args.verbose ? logJson : undefined,
};

const isSilent = args.silent || args.verbose;

if (skip(config)) {
  // eslint-disable-next-line no-console
  if (!isSilent) console.log('[mvm-skip] skip');
  exit();
} else {
  // eslint-disable-next-line no-console
  if (!isSilent) console.log('[mvm-skip] continue');
  exit(1);
}
