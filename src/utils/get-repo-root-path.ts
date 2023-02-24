import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

export const getRepoRootPath = () =>
  resolve(execSync('git rev-parse --show-toplevel').toString().trim());
