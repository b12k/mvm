import glob from 'glob';
import { join } from 'node:path';
import {
  readFileSync,
  readJsonSync,
  writeJsonSync,
  ensureFileSync,
} from 'fs-extra';

import {
  Logger,
  LockFile,
  doNothing,
  PackageJson,
  sortLockKeys,
  getDependencyType,
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
        dependencyType: getDependencyType(name, dependencies, devDependencies),
      };
    })
    .filter(({ dependencyType }) => dependencyType);

  log({ lockFilesPaths });

  lockFilesPaths.forEach(({ lockFilePath, dependencyType }) => {
    if (!dependencyType) return;

    ensureFileSync(lockFilePath);
    const lockFile = JSON.parse(
      readFileSync(lockFilePath, 'utf8') || '{}',
    ) as LockFile;

    if (lockFile.dependencies) delete lockFile.dependencies[name];
    if (lockFile.devDependencies) delete lockFile.devDependencies[name];

    const updatedLockFile = sortLockKeys({
      ...lockFile,
      [dependencyType]: {
        ...lockFile[dependencyType],
        [name]: version,
      },
    });

    writeJsonSync(lockFilePath, updatedLockFile, { spaces: 2 });
  });
};
