import { Button, Spinner } from '@bibliotheca-dao/ui-lib/base';
import { useEffect, useState } from 'react';
import { useCommandList } from '@/context/CommandListContext';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useLabor, { Entrypoints } from '@/hooks/settling/useLabor';
import { convertToK, getIsFood } from '../RealmsGetters';

export const HarvestButton = ({ generation, realmId, resourceId }) => {
  const txQueue = useCommandList();

  const [enqueuedTx, setEnqueuedTx] = useState(false);

  useEffect(() => {
    setEnqueuedTx(
      txQueue.transactions.findIndex(
        (t: any) =>
          t.contractAddress == ModuleAddr.Labor &&
          (t.entrypoint == Entrypoints.harvest_labor ||
            t.entrypoint == Entrypoints.harvest_food) &&
          t.metadata['realmId'] == realmId &&
          t.metadata['resourceId'] == resourceId
      ) >= 0
    );
  }, [txQueue.transactions]);

  const { harvest, harvest_food } = useLabor();

  const hasGenerated = generation != 0 || !isNaN(generation);

  return (
    <Button
      onClick={() => {
        if (getIsFood(resourceId)) {
          harvest_food({
            realmId: realmId,
            resourceId: resourceId,
          });
        } else {
          harvest({
            realmId: realmId,
            resourceId: resourceId,
          });
        }
      }}
      disabled={generation == 0 || isNaN(generation) || enqueuedTx}
      variant="outline"
      size="sm"
    >
      {hasGenerated && convertToK(generation)} {hasGenerated ? '' : `nothing`}
    </Button>
  );
};
