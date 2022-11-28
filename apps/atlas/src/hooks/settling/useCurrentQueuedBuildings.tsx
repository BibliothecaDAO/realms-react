import { useEffect, useState } from 'react';
import { useCommandList } from '@/context/CommandListContext';

interface Props {
  moduleAddr: string;
  entryPoint: string;
  realmId: number;
}

export const useCurrentQueuedBuildings = (props: Props) => {
  const { moduleAddr, entryPoint, realmId } = props;

  const txQueue = useCommandList();

  const [buildingIdsEnqueued, setBuildingIdsEnqueued] = useState<number[]>([]);

  useEffect(() => {
    setBuildingIdsEnqueued(
      txQueue.transactions
        .filter(
          (tx) =>
            tx.contractAddress == moduleAddr &&
            tx.entrypoint == entryPoint &&
            tx.metadata['realmId'] == realmId
        )
        .map((t) => t.metadata['buildingId'])
    );
  }, [txQueue]);

  return {
    buildingIdsEnqueued,
  };
};
