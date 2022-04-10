export { Asserts } from './utils/asserts';
export { ArrayUtils } from './utils/array-utils';
export { RandomUtils } from './utils/random-utils';
export { isValidElement, cloneElement } from './utils/react-node';

export * from './utils/typeguards';
export type { UnPromisify } from './utils/type-utils';

export const sayHello = (name: string): string => {
  return `I'm the @bibliotheca-dao/ui-lib component telling ${name} !`;
};
