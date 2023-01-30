import { Button } from '@bibliotheca-dao/ui-lib/base';
import { useEffect, useState } from 'react';
import { useCommandList } from '@/context/CommandListContext';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import { Entrypoints } from '@/hooks/settling/useTravel';

interface ArmyTravelButtonProps {
  armyId: number;
  realmId: number;
  destinationId: number;
  hasArrived: boolean;
  onClick: (armyId, realmId, armyRealmId) => void;
}

export const ArmyTravelButton = (props: ArmyTravelButtonProps) => {
  const { armyId, realmId, destinationId, onClick, hasArrived } = props;

  const txQueue = useCommandList();

  const [armyTravelling, setArmyTravelling] = useState<number[]>([]);

  useEffect(() => {
    setArmyTravelling(
      txQueue.transactions
        .filter(
          (tx) =>
            tx.contractAddress == ModuleAddr.Travel &&
            tx.entrypoint == Entrypoints.travel &&
            tx.metadata['travellerId'] == realmId &&
            tx.metadata['armyId'] == armyId
        )
        .map((t) => t.metadata['armyId'])
    );
  }, [txQueue]);
  return (
    <Button
      onClick={() => onClick(armyId, realmId, destinationId)}
      variant="outline"
      className="w-full"
      disabled={armyTravelling.includes(armyId) || !hasArrived}
      size="xs"
    >
      {armyTravelling.includes(armyId) || !hasArrived ? 'traveling' : 'Travel'}
    </Button>
  );
};
