import { defaultArmy } from '@/constants/army';
import type {
  Army,
  GetRealmsQuery,
  RealmFragmentFragment,
} from '@/generated/graphql';
import type { ArmyAndOrder } from '@/hooks/settling/useArmy';
import { useArmy } from '@/hooks/settling/useArmy';

export const hasArrived = (army) =>
  army?.destinationArrivalTime > new Date().getTime();

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
  if (armyStrength > 1000) {
    return 'V.Strong';
  } else if (armyStrength > 750) {
    return 'Strong';
  } else if (armyStrength > 250) {
    return 'Moderate';
  } else if (armyStrength > 100) {
    return 'Weak';
  } else {
    return 'V.Weak';
  }
};
