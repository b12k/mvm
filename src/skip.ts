import { execSync } from 'node:child_process';

import { Logger, doNothing } from './utils';

export interface SkipConfig {
  log?: Logger;
  name: string;
  root: string;
  workspace: string;
}

export const skip = (config: SkipConfig) => {
  const { name, workspace, root, log = doNothing as Logger } = config;

  log({ config });

  const latestTag = execSync('git tag')
    .toString()
    .split('\n')
    .reverse()
    .find((tag) => tag.includes(name));

  log({ latestTag });

  if (!latestTag) {
    log({ message: 'latest tag no found', skip: false });
    return false;
  }

  const workspaceName = workspace
    .toLowerCase()
    .replace(root.toLowerCase(), '')
    .replaceAll('\\', '/')
    .slice(1);

  log({ workspaceName });

  const touchedFiles = execSync(`git diff --name-only ${latestTag}..HEAD`)
    .toString()
    .split('\n')
    .filter((file) => Boolean(file) && file.includes(workspaceName));

  if (touchedFiles.length > 0) {
    log({
      message: 'files touched since last release',
      touchedFiles,
      skip: false,
    });
    return false;
  }

  log({ message: 'no files touched since last release', skip: true });

  return true;
};
