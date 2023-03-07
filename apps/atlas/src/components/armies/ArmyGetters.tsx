import {
  battalionInformation,
  defaultArmy,
  trueNameFromRawString,
} from '@/constants/army';
import type {
  Army,
  GetRealmsQuery,
  RealmFragmentFragment,
} from '@/generated/graphql';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import { useArmy } from '@/hooks/settling/useArmy';

export const hasArrived = (army) =>
  army?.destinationArrivalTime < new Date().getTime();

export const armyLocation = (army) =>
  army.destinationRealmId == 0 ? army.realmId : army.destinationRealmId;

export const getAttackingArmies = (
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

export const getArmyById = (armyId: number, realm: RealmFragmentFragment) => {
  return realm.ownArmies.find((a) => a.armyId === armyId) || defaultArmy;
};

// pass any Army get total defence
export const GetArmyStrength = (army: Army = defaultArmy) => {
  const { getArmyStats } = useArmy();

  if (army) {
    const armyStats = getArmyStats(army);
    return armyStrength(armyStats.totalDefence);
  }
  return 'No Army';
};

// pass any Statistic and give a context of that. Eg: Pass the Magic Defence and get a string of 'Strong' or 'Weak'
export const armyStrength = (armyStrength: number) => {
  const strengthLevels = [
    { level: 'V.V.Strong', minStrength: 2000 },
    { level: 'V.Strong', minStrength: 1500 },
    { level: 'Strong', minStrength: 1000 },
    { level: 'Moderately Strong', minStrength: 750 },
    { level: 'Moderate', minStrength: 500 },
    { level: 'Moderately Weak', minStrength: 250 },
    { level: 'Weak', minStrength: 100 },
    { level: 'V.Weak', minStrength: 0 },
  ];

  for (const strength of strengthLevels) {
    if (armyStrength > strength.minStrength) {
      return strength.level;
    }
  }
};

export const armyStrengthColors = (armyStrength: number) => {
  const strengthLevels = [
    { level: 'V.V.Strong', minStrength: 2000, color: 'text-green-600' },
    { level: 'V.Strong', minStrength: 1500, color: 'text-green-500' },
    { level: 'Strong', minStrength: 1000, color: 'text-green-400' },
    { level: 'Moderately Strong', minStrength: 750, color: 'text-yellow-500' },
    { level: 'Moderate', minStrength: 500, color: 'text-yellow-400' },
    { level: 'Moderately Weak', minStrength: 250, color: 'text-orange-500' },
    { level: 'Weak', minStrength: 100, color: 'text-red-500' },
    { level: 'V.Weak', minStrength: 0, color: 'text-red-600' },
  ];

  for (const strength of strengthLevels) {
    if (armyStrength > strength.minStrength) {
      return strength.color;
    }
  }
};

export const formatArmy = (army) => {
  const arr: any[] = [];
  battalionInformation.forEach((unit) => {
    arr.push({
      name: trueNameFromRawString(unit.name),
      quantity: army[unit.name + 'Qty'],
    });
  });

  return arr;
};
