export const getDependencyType = (
  name: string,
  dependencies: Record<string, string> = {},
  devDependencies: Record<string, string> = {},
): 'dependencies' | 'devDependencies' | undefined => {
  if (name in dependencies && dependencies[name].match(/(workspace:)?\*/)) {
    return 'dependencies';
  }

  if (
    name in devDependencies &&
    devDependencies[name].match(/(workspace:)?\*/)
  ) {
    return 'devDependencies';
  }

  return undefined;
};
