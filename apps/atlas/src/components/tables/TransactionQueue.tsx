import { Button, ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import { useEffect, useState } from 'react';
import useSound from 'use-sound';
import { TxCartItem } from '@/components/tables/Transactions';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import { useUiSounds, soundSelector } from '@/hooks/useUiSounds';
import type { ItemCost } from '@/types/index';

type Prop = {
  onSubmit?: () => void;
};

export const TransactionQueue: React.FC<Prop> = (props) => {
  const txQueue = useTransactionQueue();
  const { play } = useUiSounds(soundSelector.sign);

  const [resourceCostsById, setResourceCostsById] = useState<
    Record<string, { resourceName: string; amount: number }>
  >({});

  useEffect(() => {
    // Note: All metadata.costs are assumed to follow the ItemCost interface
    const txCosts: ItemCost[] = txQueue.transactions
      .filter((t) => !!t.metadata.costs)
      .map((t) => t.metadata.costs);

    const allResourceCosts = txCosts.map((t) => t.resources).flat(1);
    const costsByResourceId = {};
    allResourceCosts.forEach((c) => {
      costsByResourceId[c.resourceId] = {
        ...costsByResourceId[c.resourceId],
        resourceName: c.resourceName,
        amount: (costsByResourceId[c.resourceId]?.amount ?? 0) + c.amount,
      };
    });

    setResourceCostsById(costsByResourceId);
  }, [txQueue.transactions]);

  const signDecree = () => {
    play();
    txQueue
      .executeMulticall([])
      .then((_txResp) => {
        props.onSubmit && props.onSubmit();
      })
      .catch((err) => {
        console.log(err);
        // TODO: Handle error
      });
  };
  return (
    <>
      {txQueue.transactions.length > 0 ? (
        <p className="z-0 p-2 font-semibold sm:text-xl">
          Ser, your royal signature is requested to execute the following
          commands:
        </p>
      ) : null}
      <div className="flex justify-between my-2 mb-4 space-x-2">
        <Button
          disabled={txQueue.transactions.length == 0}
          className="flex-1"
          size="md"
          variant="primary"
          onClick={() => {
            signDecree();
          }}
        >
          {txQueue.transactions.length > 0
            ? `Sign for ${txQueue.transactions.length} Command${
                txQueue.transactions.length > 1 ? 's' : ''
              }`
            : 'Sign the Decree'}
        </Button>
        <Button
          disabled={txQueue.transactions.length == 0}
          size="md"
          texture={false}
          variant="outline"
          onClick={() => txQueue.empty()}
        >
          Remove All
        </Button>
      </div>
      {txQueue.transactions.map((c, i) => (
        <TxCartItem
          key={`${c.contractAddress}:${c.entrypoint}::${c.calldata
            ?.map((bignum) => bignum.toString())
            .join(':')}::${i}`}
          transaction={c}
          onRemove={() => txQueue.remove(c)}
        />
      ))}
      <div className="">
        {' '}
        {/* absolute bottom-0 left-0 w-full p-4 */}
        <h3>Total Resource Costs</h3>
        <div className="flex gap-4 mt-2">
          {Object.keys(resourceCostsById).map((resourceId) => {
            const resource = resourceCostsById[resourceId];
            return (
              <div className="flex flex-col items-center" key={resourceId}>
                <ResourceIcon size="sm" resource={resource.resourceName} />
                <span>{resource.amount}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
