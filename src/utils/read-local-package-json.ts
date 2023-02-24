import { join } from 'node:path';
import { readJsonSync } from 'fs-extra';

import { PackageJson } from './types';

export const readLocalPackageJson = () =>
  readJsonSync(join(process.cwd(), 'package.json')) as PackageJson;
