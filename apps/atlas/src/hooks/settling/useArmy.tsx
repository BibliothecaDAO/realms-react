import { useStarknetInvoke } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type {
  GetGameConstantsQuery,
  BattalionCost,
  GetRealmsQuery,
  Army,
} from '@/generated/graphql';
import {
  ModuleAddr,
  useCombatContract,
} from '@/hooks/settling/stark-contracts';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import type {
  ItemCost,
  RealmsCall,
  ResourceCost,
  BattalionInterface,
  ArmyStatistics,
  ArmyBattalionQty,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';

export const Entrypoints = {
  buildArmy: 'build_army_from_battalions',
};

export interface ArmyAndOrder extends Army {
  orderType?: string;
}
// TODO hack around mix between camel and sentence case names
export const nameArray = [
  'lightCavalry',
  'heavyCavalry',
  'archer',
  'longbow',
  'mage',
  'arcanist',
  'lightInfantry',
  'heavyInfantry',
];

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

  const [battalions, setBattalions] = useState<BattalionInterface[]>();

  const findBattalionStat = (id, type?) => {
    return gameConstants?.battalionStats.find(
      (a) => a.battalionId === id && a.type === type
    );
  };

  const createBattalionStats = (id) => {
    return {
      attack: findBattalionStat(id, '')?.value || 0,
      type:
        gameConstants?.battalionStats.find(
          (a) => a.battalionId === id && a.combatType === 'defense'
        )?.type || 'unknown',
      cavalryDefence: findBattalionStat(id, 'cavalry')?.value || 0,
      archeryDefence: findBattalionStat(id, 'archery')?.value || 0,
      magicDefence: findBattalionStat(id, 'magic')?.value || 0,
      infantryDefence: findBattalionStat(id, 'infantry')?.value || 0,
      buildingId: findBattalionStat(id, '')?.requiredBuildingId || 0,
    };
  };

  const getBattalionStat = (name): BattalionInterface | undefined => {
    return battalions?.find((a) => a.battalionName === name);
  };

  const findRealmsAttackingArmies = (
    realms?: GetRealmsQuery['realms']
  ): ArmyAndOrder[] | undefined => {
    return realms?.flatMap(({ orderType, ownArmies }) =>
      ownArmies.length
        ? ownArmies
            .filter((army) => army.armyId != 0)
            .map((army) => {
              return { ...army, orderType };
            })
        : []
    );
  };

  const calcArmyDefence = (type) => {
    return battalions;
  };

  const getArmyCost = (armyQtys: ArmyBattalionQty): ResourceCost[] => {
    const info: any = [];
    Object.keys(armyQtys).forEach((key) => {
      const correctKey = (key.charAt(0).toUpperCase() + key.slice(1)).slice(
        0,
        -3
      );
      const battalionStat = getBattalionStat(correctKey)?.battalionCost.map(
        (cost) => {
          return { ...cost, amount: cost.amount * armyQtys[key] };
        }
      );
      if (battalionStat) {
        info.push(...battalionStat.flat());
      }
    });
    return info.reduce((acc, curr) => {
      const index = acc.findIndex(
        (item) => item.resourceId === curr.resourceId
      );
      index > -1
        ? (acc[index].amount += curr.amount)
        : acc.push({
            resourceId: curr.resourceId,
            amount: curr.amount,
            resourceName: curr.resourceName,
          });
      return acc;
    }, []);
  };

  // TODO Dirty - to improve once stabilised
  const getArmyStats = (army?: Army | ArmyBattalionQty): ArmyStatistics => {
    return {
      cavalryAttack: army
        ? army.lightCavalryQty *
            (getBattalionStat('LightCavalry')?.attack || 0) +
          army.heavyCavalryQty * (getBattalionStat('HeavyCavalry')?.attack || 0)
        : 0,
      archeryAttack: army
        ? army.archerQty * (getBattalionStat('Archer')?.attack || 0) +
          army.longbowQty * (getBattalionStat('Longbow')?.attack || 0)
        : 0,
      magicAttack: army
        ? army.mageQty * (getBattalionStat('Mage')?.attack || 0) +
          army.arcanistQty * (getBattalionStat('Arcanist')?.attack || 0)
        : 0,
      infantryAttack: army
        ? army.lightInfantryQty *
            (getBattalionStat('LightInfantry')?.attack || 0) +
          army.heavyInfantryQty *
            (getBattalionStat('HeavyInfantry')?.attack || 0)
        : 0,
      cavalryDefence: 100,
      archeryDefence: 0,
      magicDefence: 20,
      infantryDefence: 0,
    };
  };

  useEffect(() => {
    console.log(gameConstants);
    setBattalions(
      gameConstants?.battalionCosts.map((a, i) => {
        return {
          battalionId: a.battalionId,
          index: i,
          battalionName: a.battalionName,
          battalionCost: a.resources,
          ...createBattalionStats(a.battalionId),
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
    battalions,
    getArmyStats,
    getArmyCost,
    findRealmsAttackingArmies,
  };
};
