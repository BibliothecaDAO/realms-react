import { useEffect, useState } from 'react';
import { RealmBuildingsSize, STORE_HOUSE_SIZE } from '@/constants/globals';
import { useCommandList } from '@/context/CommandListContext';
import { ModuleAddr } from './stark-contracts';
import { Entrypoints as BuildingEntrypoints } from './useBuildings';
import { Entrypoints as FoodEntrypoints } from './useFood';

interface Props {
  realmId: number;
}

export const useProjectedBuildingSpace = (props: Props) => {
  const { realmId } = props;

  const txQueue = useCommandList();

  const [buildingIdsEnqueued, setBuildingIdsEnqueued] = useState<number[]>([]);
  const [storehouseEnqueued, setStorehouseEnqueued] = useState<string[]>([]);

  useEffect(() => {
    setBuildingIdsEnqueued(
      txQueue.transactions
        .filter(
          (tx) =>
            tx.contractAddress == ModuleAddr.Building &&
            tx.entrypoint == BuildingEntrypoints.build &&
            tx.metadata['realmId'] == realmId
        )
        .map((t) => t.metadata['buildingId'])
    );
    setStorehouseEnqueued(
      txQueue.transactions
        .filter(
          (tx) =>
            tx.contractAddress == ModuleAddr.Food &&
            tx.entrypoint == FoodEntrypoints.convert &&
            tx.metadata['realmId'] == realmId
        )
        .map((t) => t.metadata['quantity'])
    );

    console.log('storehouseEnqueued', storehouseEnqueued);
    console.log('buildingIdsEnqueued', buildingIdsEnqueued);
  }, [txQueue]);

  return {
    buildingSpaceEnqueued:
      buildingIdsEnqueued.length * RealmBuildingsSize.Castle,
    storehouseSpaceEnqueued:
      storehouseEnqueued.reduce((a, b) => a + parseInt(b), 0) /
      STORE_HOUSE_SIZE,
  };
};
