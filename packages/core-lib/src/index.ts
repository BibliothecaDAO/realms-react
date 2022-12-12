export { ArrayUtils } from './utils/array-utils';
export { RandomUtils } from './utils/random-utils';
import useCountdown from './hooks/use-countdown';
export { useCountdown };

export const sayHello = (name: string): string => {
  return `I'm the @bibliotheca-dao/ui-lib component telling ${name} !`;
};
