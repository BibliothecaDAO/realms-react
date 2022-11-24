import { useEffect, useState } from 'react';
import type { GetRealmsQuery, Army } from '@/generated/graphql';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import type {
  ResourceCost,
  BattalionInterface,
  ArmyStatistics,
  ArmyBattalionQty,
} from '@/types/index';

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

export const useArmy = () => {
  const { gameConstants } = useGameConstants();

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

  const calculateDefence = (
    defence: string,
    army?: Army | ArmyBattalionQty | undefined
  ) => {
    const lightCavalryDefence =
      getBattalionStat('LightCavalry')?.[defence] *
        (army?.lightCavalryQty || 0) || 0;
    const heavyCavalryDefence =
      getBattalionStat('HeavyCavalry')?.[defence] *
        (army?.heavyCavalryQty || 0) || 0;
    const archerDefence =
      getBattalionStat('Archer')?.[defence] * (army?.archerQty || 0) || 0;
    const longbowDefence =
      getBattalionStat('Longbow')?.[defence] * (army?.longbowQty || 0) || 0;
    const mageDefence =
      getBattalionStat('Mage')?.[defence] * (army?.mageQty || 0) || 0;
    const arcanistDefence =
      getBattalionStat('Arcanist')?.[defence] * (army?.arcanistQty || 0) || 0;
    const lightInfantryDefence =
      getBattalionStat('LightInfantry')?.[defence] *
        (army?.lightInfantryQty || 0) || 0;
    const heavyInfantryDefence =
      getBattalionStat('HeavyInfantry')?.[defence] *
        (army?.heavyInfantryQty || 0) || 0;

    return (
      lightCavalryDefence +
      heavyCavalryDefence +
      archerDefence +
      longbowDefence +
      mageDefence +
      arcanistDefence +
      lightInfantryDefence +
      heavyInfantryDefence
    );
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
      cavalryDefence: calculateDefence('cavalryDefence', army),
      archeryDefence: calculateDefence('archeryDefence', army),
      magicDefence: calculateDefence('magicDefence', army),
      infantryDefence: calculateDefence('infantryDefence', army),
    };
  };

  useEffect(() => {
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
    battalions,
    getArmyStats,
    getArmyCost,
    findRealmsAttackingArmies,
  };
};
