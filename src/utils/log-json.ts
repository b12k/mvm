import { Logger } from './types';

export const logJson: Logger = (entry) =>
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry, undefined, 2));
