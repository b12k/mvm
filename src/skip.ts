import { execSync } from 'node:child_process';

import { Logger, doNothing, toSemver } from './utils';

export interface SkipConfig {
  log?: Logger;
  name: string;
  root: string;
  workspace: string;
}

export const skip = (config: SkipConfig) => {
  const { name, workspace, root, log = doNothing as Logger } = config;

  log({ config });

  const relatedTags = execSync('git tag')
    .toString()
    .split('\n')
    .filter((tag) => tag.includes(name));

  if (relatedTags.length === 0) {
    log({ message: 'no related tags found', skip: false });
    return false;
  }

  const latestVersion = toSemver(relatedTags)[0];

  if (!latestVersion) {
    log({ message: 'no latest version found', skip: false });
    return false;
  }

  log({ latestVersion });

  const latestTag = relatedTags.find((tag) => tag.includes(latestVersion));

  if (!latestTag) {
    log({ message: 'no latest tag found', skip: false });
    return false;
  }

  log({ latestTag });

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
