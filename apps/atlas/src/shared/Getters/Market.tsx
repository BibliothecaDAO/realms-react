import type { ItemCost } from '@/types/index';

export const RateChange = (change: number) => {
  const x = (change * 100).toFixed(2);
  return (
    <span
      className={`${
        parseInt(x) < 0 ? 'text-red-200' : 'text-green-200/80'
      } text-xs`}
    >
      24hr {x} %
    </span>
  );
};

export const getTxCosts = (txQueue) => {
  return txQueue.transactions
    .filter((t) => !!t.metadata.costs)
    .map((t) => t.metadata.costs);
};
