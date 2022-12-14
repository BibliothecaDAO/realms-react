import { ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import { formatEther } from '@ethersproject/units';
import { useAccount } from '@starknet-react/core';
import { ethers, BigNumber } from 'ethers';
import {
  ATTACK_COOLDOWN_PERIOD,
  BASE_HAPPINESS,
  BASE_RESOURCES_PER_DAY,
  buildingPopulation,
  DAY,
  HAPPINESS_TIME_PERIOD_TICK,
  MAX_DAYS_ACCURED,
  NO_DEFENDING_ARMY_LOSS,
  NO_FOOD_LOSS,
  NO_RELIC_LOSS,
  PILLAGE_AMOUNT,
  SECONDS_PER_KM,
} from '@/constants/buildings';
import { findResourceById, resources } from '@/constants/resources';
import type { Army, Realm, RealmFragmentFragment } from '@/generated/graphql';
import RealmsData from '@/geodata/realms.json';
import { useArmy } from '@/hooks/settling/useArmy';
import { useGameConstants } from '@/hooks/settling/useGameConstants';
import type { BuildingDetail } from '@/types/index';

interface TraitProps {
  trait: string;
  traitAmount?: number;
}

export const RealmStatus = (realm: RealmFragmentFragment) => {
  return [RealmStateStatus(realm), RealmVaultStatus(realm)]
    .filter(Boolean)
    .join(', ');
};

export const RealmStateStatus = (realm: RealmFragmentFragment) => {
  if (realm.bridgedOwner) {
    return 'Bridge Pending';
  }
  if (realm.settledOwner) {
    return 'Settled & Generating';
  }
  if (realm.ownerL2) {
    return 'Unsettled L2';
  } else {
    return 'Mainnet & Unsettled';
  }
};

export const IsSettled = (realm: RealmFragmentFragment) => {
  return RealmStateStatus(realm) === 'Settled & Generating';
};

export const RealmOwner = (realm: RealmFragmentFragment) => {
  return (
    realm?.settledOwner ||
    realm?.ownerL2 ||
    realm?.bridgedOwner ||
    realm?.owner ||
    '0'
  );
};

export const TimeSince = (time: number) => {
  const now = Date.now();
  const lastVaultTime = new Date(time);
  return (now - lastVaultTime.getTime()) / 1000 / 60;
};

export const RealmVaultStatus = (realm: RealmFragmentFragment) => {
  if (!realm.lastVaultTime) {
    return '';
  }
  const now = Date.now();
  const lastVaultTime = new Date(realm.lastVaultTime);
  const minutesSinceLastVault = (now - lastVaultTime.getTime()) / 1000 / 60;
  const minutesToVault = DAY / 60; // 24 hours
  if (minutesSinceLastVault >= minutesToVault) {
    return `Raidable`;
  }

  const minutesRemaining = minutesToVault - minutesSinceLastVault;
  const hours = Math.floor(minutesRemaining / 60);
  const minutes = Math.floor(minutesRemaining % 60);
  if (hours > 0) {
    return `Raidable in ${hours}h ${minutes}m`;
  } else {
    return `Raidable in ${minutes}m`;
  }
};

export const TraitTable = (props: TraitProps) => {
  const traitSet = [
    {
      trait: 'Region',
      colour: 'bg-green-200/50',
      traitMax: 7,
      title: 'Regions',
    },
    { trait: 'City', colour: 'bg-amber-300/50', traitMax: 21, title: 'Cities' },
    {
      trait: 'Harbor',
      colour: 'bg-amber-500/50',
      traitMax: 35,
      title: 'Harbors',
    },
    {
      trait: 'River',
      colour: 'bg-blue-700/50',
      traitMax: 60,
      title: 'Rivers',
    },
  ];

  const getTrait = () => {
    return traitSet.find((a) => a.trait == props.trait);
  };

  const getWidth = () => {
    return ((props.traitAmount as any) / (getTrait()?.traitMax || 0)) * 100;
  };

  return (
    <div>
      <span className="flex justify-between">
        <span className="uppercase">{getTrait()?.title} </span>
        <span>
          {props.traitAmount} / {getTrait()?.traitMax}{' '}
        </span>
      </span>
      <div className="w-full my-1 rounded-full bg-stone-100/10">
        <div
          className={`h-1 ${getTrait()?.colour} shadow-inner rounded-full`}
          style={{
            width: `${getWidth()}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export const IsOwner = (owner?: string | null) => {
  const { address } = useAccount();
  const starknetWallet = address ? BigNumber.from(address).toHexString() : '';

  if (address) {
    return starknetWallet == owner ? true : false;
  } else {
    return false;
  }
};

export const getOrder = (realm: RealmFragmentFragment) => {
  return realm.orderType.toLowerCase();
};

export const getAccountHex = (account: string) => {
  return ethers.BigNumber.from(account).toHexString();
};

export const squadStats = (squad: any) => {
  if (!squad) {
    return { agility: 0, attack: 0, armor: 0, vitality: 0, wisdom: 0 };
  }
  return {
    /* agility: squad
      .map((troop) => troop.agility)
      .reduce((prev, curr) => prev + curr, 0),
    attack: squad
      .map((troop) => troop.attack)
      .reduce((prev, curr) => prev + curr, 0),
    armor: squad
      .map((troop) => troop.armor)
      .reduce((prev, curr) => prev + curr, 0),
    vitality: squad
      .map((troop) => troop.vitality)
      .reduce((prev, curr) => prev + curr, 0),
    wisdom: squad
      .map((troop) => troop.wisdom)
      .reduce((prev, curr) => prev + curr, 0), */
  };
};

export const getTrait = (realm: any, trait: string) => {
  return realm?.traits?.find((o) => o.type === trait)
    ? realm.traits?.find((o) => o.type === trait).qty
    : '0';
};

export const trimmedOrder = (realm: RealmFragmentFragment | undefined) => {
  return (
    realm?.orderType
      ?.replaceAll('_', ' ')
      .replace('the ', '')
      .replace('the_', '')
      .toLowerCase() ?? ''
  );
};

export const ownerRelic = (realm: RealmFragmentFragment | undefined) => {
  return realm?.relic && realm?.relic[0] && realm?.relic[0].heldByRealm
    ? realm?.relic[0].heldByRealm
    : realm?.realmId;
};

export const relicsOwnedByRealm = (
  realm: RealmFragmentFragment | undefined
) => {
  return realm?.relicsOwned &&
    realm?.relicsOwned[0] &&
    realm?.relicsOwned.length
    ? realm?.relicsOwned.length
    : 0;
};

export const resourcePillaged = (resources: any) => {
  return (
    <div className="mx-auto my-4">
      {resources.length ? (
        resources?.map((resource, index) => {
          const info = findResourceById(resource.resourceId);
          return (
            <div
              className="flex justify-between my-1 font-display "
              key={index}
            >
              <div className="flex">
                <ResourceIcon
                  size="xs"
                  className="self-center"
                  resource={info?.trait?.replace('_', '') as string}
                />{' '}
                <span className="self-center ml-4 mr-1">{info?.trait}</span>
              </div>

              <div className="self-center font-semibold uppercase">
                {(+formatEther(resource.amount)).toLocaleString()}
              </div>
            </div>
          );
        })
      ) : (
        <span>No Resources pillaged</span>
      )}
    </div>
  );
};

export const hasOwnRelic = (realm: RealmFragmentFragment | undefined) => {
  return realm?.relic && realm?.relic.length ? false : true;
};

export const getRealmNameById = (id: number | undefined) => {
  return RealmsData.features.find((realm) => realm.id == id)
    ? RealmsData.features.find((realm) => realm.id == id)?.name
    : '';
};

export const RealmClaimable = (realm: RealmFragmentFragment) => {
  if (!realm.lastClaimTime) {
    return false;
  }

  const cachedDaysAccrued = parseInt(
    ((new Date().getTime() - realm?.lastClaimTime) / DAY / 1000).toFixed(2)
  );
  return cachedDaysAccrued >= 1 ? true : false;
};

export const getRealmCombatStatus = (realm: RealmFragmentFragment) => {
  if (!getIsRaidable(realm)) {
    return 'Raidable';
  }
  const now = Date.now();
  const lastVaultTime = new Date(realm.lastAttacked);
  const minutesSinceLastVault = (now - lastVaultTime.getTime()) / 1000 / 60;
  const minutesToVault = ATTACK_COOLDOWN_PERIOD / 60; // 24 hours
  if (minutesSinceLastVault >= minutesToVault) {
    return `Raidable`;
  }

  const minutesRemaining = minutesToVault - minutesSinceLastVault;
  const hours = Math.floor(minutesRemaining / 60);
  const minutes = Math.floor(minutesRemaining % 60);
  if (hours > 0) {
    return `Raidable in ${hours}h ${minutes}m`;
  } else {
    return `Raidable in ${minutes}m`;
  }
};

export const getIsRaidable = (realm: RealmFragmentFragment) => {
  const now = Date.now();
  const lastVaultTime = new Date(realm.lastAttacked);
  const minutesSinceLastVault = (now - lastVaultTime.getTime()) / 1000 / 60;
  const minutesToVault = ATTACK_COOLDOWN_PERIOD / 60; // 24 hours
  return minutesToVault >= minutesSinceLastVault;
};

export const CostBlock = ({ resourceName, amount, id, qty }) => {
  const { checkUserHasAvailableResources } = useGameConstants();

  return (
    <div className="p-1 text-center border rounded border-white/30">
      <ResourceIcon withTooltip size="xs" resource={resourceName} />
      <span
        className={
          checkUserHasAvailableResources({
            cost: amount * qty,
            id: id,
          })
            ? 'text-green-600 shadow-green-100 drop-shadow-lg'
            : 'text-red-200'
        }
      >
        {(amount * qty).toFixed(0)}
      </span>
    </div>
  );
};

const getCoordinates = (id: number) => {
  return RealmsData.features.find((a) => a.id === id);
};

export const getTravelTime = ({ travellerId, destinationId }) => {
  const distance = (x1, y1, x2, y2) => {
    const a = x1 - x2;
    const b = y1 - y2;

    return Math.sqrt(a * a + b * b);
  };

  const travellerCoordinates = getCoordinates(travellerId);
  const destinationCoordinates = getCoordinates(destinationId);

  const d = distance(
    travellerCoordinates?.xy[0],
    travellerCoordinates?.xy[1],
    destinationCoordinates?.xy[0],
    destinationCoordinates?.xy[1]
  ).toFixed(2);

  return { distance: d, time: parseInt(d) * SECONDS_PER_KM };
};

export const getTravelArcs = (location: number, assets: number[]) => {
  return assets.map((a) => {
    return {
      source: getCoordinates(location)?.xy,
      target: getCoordinates(a)?.xy,
      value: 2,
      gain: 3,
      quantile: 1,
    };
  });
};

export const isYourRealm = (
  realm: RealmFragmentFragment,
  account?: string,
  starkAccount?: string
) =>
  (account &&
    (account.toLowerCase() === realm.owner ||
      account.toLowerCase() === realm.bridgedOwner)) ||
  (starkAccount &&
    (starkAccount.toLowerCase() === realm.ownerL2 ||
      starkAccount.toLowerCase() === realm.settledOwner));

export const isFavourite = (
  realm: RealmFragmentFragment,
  favouriteRealms: number[]
) => favouriteRealms.indexOf(realm.realmId) > -1;

const DAY_MS = DAY * 1000;

export const getDays = (time) => {
  return Math.floor((Date.now() - time) / DAY_MS);
};

export const getRemainingDays = (time) => {
  const offsetClaimtime = time % DAY_MS;
  const remainingDay = DAY_MS - (Date.now() % DAY_MS);
  return remainingDay + offsetClaimtime + Date.now();
};

export const maxClaimableResources = (daysAccrued: number) =>
  daysAccrued > MAX_DAYS_ACCURED
    ? BASE_RESOURCES_PER_DAY * MAX_DAYS_ACCURED
    : BASE_RESOURCES_PER_DAY * daysAccrued;

export const vaultResources = (vault) =>
  vault * BASE_RESOURCES_PER_DAY * (PILLAGE_AMOUNT / 100);

export const daysAccrued = (daysAccrued) =>
  daysAccrued > MAX_DAYS_ACCURED ? MAX_DAYS_ACCURED : daysAccrued;

export const getHappinessHasOwnRelic = ({ realm }) => {
  return hasOwnRelic(realm) ? 0 : NO_RELIC_LOSS;
};

export const getHappinessHasFood = ({ food }) => {
  return food > 0 ? 0 : NO_FOOD_LOSS;
};

export const getHappinessHasDefendingArmy = ({ realm }) => {
  return realm?.ownArmies?.length > 0 ? 0 : NO_DEFENDING_ARMY_LOSS;
};

export const getHappiness = ({ realm, food }) => {
  const hasRelic = getHappinessHasOwnRelic({ realm: realm });

  const hasFood = getHappinessHasFood({ food: food });

  const hasDefendingArmy = getHappinessHasDefendingArmy({ realm: realm });

  return BASE_HAPPINESS - hasRelic - hasFood - hasDefendingArmy;
};

export const getHappinessIcon = ({ realm, food }) => {
  const happiness = getHappiness({ realm, food });

  if (happiness >= BASE_HAPPINESS) {
    return '😀';
  } else {
    return '😢';
  }
};

export const getBuildingPopulation = (realm: RealmFragmentFragment) => {
  let buildingPop = 0;

  realm.buildings
    ?.map((b) => {
      return { id: b.buildingId };
    })
    .forEach((b) => {
      const bpop = buildingPopulation(b.id);
      buildingPop += bpop;
    });

  return buildingPop;
};

export const getTroopPopulation = (realm: RealmFragmentFragment) => {
  const troopPrePopulation = realm.ownArmies
    .map((a) => {
      return {
        arcanistQty: a.arcanistQty,
        archerQty: a.archerQty,
        heavyCavalryQty: a.heavyCavalryQty,
        heavyInfantryQty: a.heavyInfantryQty,
        lightCavalryQty: a.lightCavalryQty,
        lightInfantryQty: a.lightInfantryQty,
        longbowQty: a.longbowQty,
        mageQty: a.mageQty,
      };
    })
    .reduce((accumulator, item) => {
      Object.keys(item).forEach((key) => {
        accumulator[key] = (accumulator[key] || 0) + item[key];
      });

      return accumulator;
    }, {});

  const troopPopulation: any = Object.values(troopPrePopulation).reduce(
    (a: any, b: any) => a + b,
    0
  );

  return troopPopulation;
};

export const getPopulation = (realm: RealmFragmentFragment) => {
  return getBuildingPopulation(realm) + getTroopPopulation(realm) + 1;
};

export const getFoodIcon = (food: number) => {
  if (food > 0) {
    return '🍞';
  } else {
    return '☠️';
  }
};

export const getMilitaryBuildingsBuilt = (
  buildings: BuildingDetail[] | undefined
) => {
  return buildings
    ?.filter((a) => a.type === 'military')
    .filter((b) => b.quantityBuilt > 0)
    .map((c) => c.id);
};

export const getTimeSinceLastTick = (realm: RealmFragmentFragment) => {
  // date from unix timestamp
  const date = new Date(realm.lastTick);
  const now = new Date();

  return (
    Math.floor((now.getTime() - date.getTime()) / 1000) /
    60 /
    60
  ).toFixed(2);
};

export const getNumberOfTicks = (realm: RealmFragmentFragment) => {
  return Math.floor(
    parseInt(getTimeSinceLastTick(realm)) / HAPPINESS_TIME_PERIOD_TICK
  );
};

export const getTimeUntilNextTick = (realm: RealmFragmentFragment) => {
  return Math.floor(
    HAPPINESS_TIME_PERIOD_TICK / 60 / 60 -
      (parseInt(getTimeSinceLastTick(realm)) % HAPPINESS_TIME_PERIOD_TICK)
  );
};

export const resourcesToString = (a) => {
  return resources.find((r) => r.trait === a)?.id ?? 0;
};

// pass any Army get total defence
export const GetArmyStrength = (
  realm: RealmFragmentFragment,
  armyId: number
) => {
  const { getArmyStats } = useArmy();
  const army = realm.ownArmies.find((a) => a.armyId === armyId);

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
