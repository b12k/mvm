export type Logger = (entry: Record<string, unknown>) => void;

export interface LockFile {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}
