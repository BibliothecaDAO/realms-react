import { useStarknetInvoke } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type {
  GetGameConstantsQuery,
  BattalionCost,
  BattalionStats,
} from '@/generated/graphql';
import {
  ModuleAddr,
  useCombatContract,
} from '@/hooks/settling/stark-contracts';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import type {
  ItemCost,
  RealmsCall,
  RealmsTransactionRenderConfig,
  ArmyInterface,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';

export const Entrypoints = {
  buildArmy: 'build_army_from_battalions',
};

export const createCall: Record<string, (args: any) => RealmsCall> = {
  buildArmy: (args: { realmId; armyId; ids; qty; costs }) => ({
    contractAddress: ModuleAddr.Combat,
    entrypoint: Entrypoints.buildArmy,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(toBN(args.realmId))),
      args.armyId,
      args.ids.length,
      ...args.ids,
      args.qty.length,
      ...args.qty,
    ],
    metadata: { ...args, action: Entrypoints.buildArmy },
  }),
};

export const useArmy = () => {
  const txQueue = useTransactionQueue();
  const { contract } = useCombatContract();
  const { gameConstants } = useGameConstants();
  const { play: raidSound } = useUiSounds(soundSelector.raid);

  const [armyBattalions, setArmyBattalions] = useState<ArmyInterface[]>();

  const getBattalionStats = (id) => {
    return {
      attack:
        gameConstants?.battalionStats.find(
          (a) => a.battalionId === id && a.type === ''
        )?.value || 0,
      type:
        gameConstants?.battalionStats.find((a) => a.battalionId === id)?.type ||
        'unknown',
      cavalryDefence:
        gameConstants?.battalionStats.find(
          (a) => a.battalionId === id && a.type === 'cavalry'
        )?.value || 0,
      archeryDefence:
        gameConstants?.battalionStats.find(
          (a) => a.battalionId === id && a.type === 'archery'
        )?.value || 0,
      magicDefence:
        gameConstants?.battalionStats.find(
          (a) => a.battalionId === id && a.type === 'magic'
        )?.value || 0,
      infantryDefence:
        gameConstants?.battalionStats.find(
          (a) => a.battalionId === id && a.type === 'infantry'
        )?.value || 0,
      buildingId:
        gameConstants?.battalionStats.find((a) => a.battalionId === id)
          ?.requiredBuildingId || 0,
    };
  };

  useEffect(() => {
    setArmyBattalions(
      gameConstants?.battalionCosts.map((a, i) => {
        return {
          battalionId: a.battalionId,
          index: i,
          battalionName: a.battalionName,
          battalionCost: a.resources,
          ...getBattalionStats(a.battalionId),
        };
      })
    );
  }, [gameConstants]);

  return {
    build: (
      realmId,
      battalionIdsAndCosts: { id: any; cost?: ItemCost }[],
      squadSlot
    ) => {
      const totalCost: ItemCost = battalionIdsAndCosts.reduce<ItemCost>(
        (agg, curr) => {
          if (!curr.cost) {
            return agg;
          }
          return {
            amount: agg.amount + curr.cost.amount,
            resources: agg.resources.concat(curr.cost.resources),
          };
        },
        {
          amount: 0,
          resources: [],
        }
      );

      txQueue.add(
        createCall.buildSquad({
          realmId,
          battalionIds: battalionIdsAndCosts.map((t) => t.id),
          squadSlot,
          costs: totalCost,
        })
      );
    },
    armyBattalions,
  };
};
