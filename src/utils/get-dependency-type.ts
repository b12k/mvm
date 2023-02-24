export const getDependencyType = (
  name: string,
  dependencies: Record<string, string> = {},
  devDependencies: Record<string, string> = {},
): 'dependencies' | 'devDependencies' | undefined => {
  if (name in dependencies && dependencies[name] === '*') {
    return 'dependencies';
  }

  if (name in devDependencies && devDependencies[name] === '*') {
    return 'devDependencies';
  }

  return undefined;
};
