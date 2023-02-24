import glob from 'glob';
import { join } from 'node:path';
import {
  ensureFileSync,
  readFileSync,
  writeJsonSync,
  readJsonSync,
} from 'fs-extra';

import {
  PackageJson,
  getDependencyType,
  doNothing,
  Logger,
  LockFile,
} from './utils';

export interface UpdateConfig {
  root: string;
  name: string;
  version: string;
  log?: Logger;
}

export const update = (config: UpdateConfig) => {
  const { root, name, version, log = doNothing as Logger } = config;

  log({ config });

  const packageJsonFilesPaths = glob
    .sync('**/package.json', {
      ignore: ['**/node_modules/**'],
      cwd: root,
    })
    .map((file) => join(root, file));

  log({ packageJsonFilesPaths });

  const lockFilesPaths = packageJsonFilesPaths
    .map((filePath) => {
      const { dependencies, devDependencies } = readJsonSync(
        filePath,
      ) as PackageJson;

      return {
        lockFilePath: filePath.replace('package.json', 'mvm.lock'),
        dependency: getDependencyType(name, dependencies, devDependencies),
      };
    })
    .filter(({ dependency }) => dependency);

  log({ lockFilesPaths });

  lockFilesPaths.forEach(({ lockFilePath, dependency }) => {
    if (!dependency) return;

    ensureFileSync(lockFilePath);
    const lockFile = JSON.parse(
      readFileSync(lockFilePath, 'utf8') || '{}',
    ) as LockFile;
    const updatedLockFile: LockFile = {
      ...lockFile,
      [dependency]: {
        ...lockFile[dependency],
        [name]: version,
      },
    };

    writeJsonSync(lockFilePath, updatedLockFile);
  });
};
