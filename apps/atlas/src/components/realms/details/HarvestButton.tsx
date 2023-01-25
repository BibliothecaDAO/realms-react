import { Button, Spinner } from '@bibliotheca-dao/ui-lib/base';
import { useEffect, useState } from 'react';
import { useCommandList } from '@/context/CommandListContext';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import useLabor, { Entrypoints } from '@/hooks/settling/useLabor';

export const HarvestButton = ({ generation, realmId, resourceId }) => {
  const txQueue = useCommandList();

  const [enqueuedTx, setEnqueuedTx] = useState(false);

  useEffect(() => {
    setEnqueuedTx(
      !!txQueue.transactions.find(
        (t: any) =>
          t.contractAddress == ModuleAddr.Labor &&
          t.entrypoint == Entrypoints.harvest_labor &&
          t.metadata['realmId'] == realmId &&
          t.metadata['resourceId'] == resourceId
      )
    );
  }, [txQueue.transactions]);

  const { harvest } = useLabor();

  return (
    <Button
      onClick={() =>
        harvest({
          realmId: realmId,
          resourceId: resourceId,
        })
      }
      disabled={generation == 0 || isNaN(generation) || enqueuedTx}
      variant="outline"
      size="xs"
    >
      {generation == 0 || isNaN(generation) ? 'nothing available' : `Harvest`}
    </Button>
  );
};
