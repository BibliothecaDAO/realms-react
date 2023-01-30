import { ResourceIcon } from '@bibliotheca-dao/ui-lib/base';
import { formatEther } from '@ethersproject/units';
import { useAccount } from '@starknet-react/core';
import { ethers, BigNumber } from 'ethers';
import {
  ATTACK_COOLDOWN_PERIOD,
  BASE_HAPPINESS,
  BASE_LABOR_UNITS,
  BASE_RESOURCES_PER_CYCLE,
  BASE_RESOURCES_PER_DAY,
  buildingPopulation,
  DAY,
  HAPPINESS_TIME_PERIOD_TICK,
  MAX_DAYS_ACCURED,
  NO_DEFENDING_ARMY_LOSS,
  NO_FOOD_LOSS,
  NO_RELIC_LOSS,
  PILLAGE_AMOUNT,
  RealmHappinessImages,
  SECONDS_PER_KM,
  STORE_HOUSE_SIZE,
} from '@/constants/globals';
import {
  findResourceById,
  resources,
  ResourcesIds,
} from '@/constants/resources';
import type { Army, Realm, RealmFragmentFragment } from '@/generated/graphql';
import RealmsData from '@/geodata/realms.json';
import RawRealmsData from '@/geodata/realms_raw.json';
import { useMarketRate } from '@/hooks/market/useMarketRate';
import { ArmyAndOrder, useArmy } from '@/hooks/settling/useArmy';
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
                <div>
                  <ResourceIcon
                    size="xs"
                    className="self-center"
                    resource={info?.trait?.replace('_', '') as string}
                  />{' '}
                </div>

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

export const getRealmOrderById = (id: number | undefined) => {
  return RawRealmsData.find((realm) => realm.id === id)
    ? RawRealmsData.find((realm) => realm.id === id)?.order
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
    <div className="p-1 text-center border rounded border-white/10">
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
        {(amount * qty).toFixed(2)}
      </span>
    </div>
  );
};

export const getCoordinates = (id: number) => {
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
  return getIsRealmAnnexed(realm) ? 0 : NO_RELIC_LOSS;
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

export const getHappinessImage = ({ realm, food }) => {
  const happiness = getHappiness({ realm, food });

  if (happiness >= BASE_HAPPINESS) {
    return RealmHappinessImages.Abundant;
  } else if (happiness >= 95) {
    return RealmHappinessImages.Average;
  } else {
    return RealmHappinessImages.Unhappy;
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

  const time = Math.floor((now.getTime() - date.getTime()) / 1000) / 60 / 60;

  return time > 1000 ? '0' : time.toFixed();
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

export const hasSettledRealms = (userRealms, address) => {
  return (
    userRealms &&
    userRealms.some(
      (r) => r.settledOwner === getAccountHex(address || '0x0') ?? 0
    )
  );
};

export const getLaborUnitsGenerated = (time): number => {
  return time / 1000 / BASE_LABOR_UNITS;
};

export const getUnproducedLabor = (labor_balance) => {
  const now = new Date().getTime();
  const balance = labor_balance - now;

  const labor_units = balance / 1000 / BASE_LABOR_UNITS;
  return labor_units > 0 ? labor_units.toFixed(2) : 0;
};

export const getLaborGenerated = ({
  last_harvest,
  labor_balance,
}): number[] => {
  const now = new Date().getTime();
  const lastHarvest = new Date(last_harvest);

  let labor;

  if (labor_balance > now) {
    labor = (now - lastHarvest.getTime()) / 1000;
  } else {
    labor = (labor_balance - lastHarvest.getTime()) / 1000;
  }

  const generated_labor = ((labor / BASE_LABOR_UNITS) * 0.7).toFixed(2);

  const labor_remaining = labor % BASE_LABOR_UNITS;

  const vault = parseInt(generated_labor) * 0.3;

  let remaining;

  if (labor_balance < now) {
    remaining = 0;
  } else {
    remaining = labor_remaining / BASE_LABOR_UNITS;
  }

  return [parseInt(generated_labor), remaining, vault];
};

export const getVaultRaidableLaborUnits = (time): number => {
  return (
    getLaborUnitsGenerated(time || 0) *
    BASE_RESOURCES_PER_CYCLE *
    (PILLAGE_AMOUNT / 100)
  );
};

export const checkIsRaidable = (realm: RealmFragmentFragment) => {
  const resource_length = realm?.resources?.filter((r) => {
    return getVaultRaidableLaborUnits(r.labor?.vaultBalance) > 0;
  });

  return resource_length && resource_length.length > 0 ? false : true;
};

export const getHolderOfRelic = (realm: RealmFragmentFragment) => {
  return realm?.relic && realm?.relic.length ? realm?.relic[0].heldByRealm : 0;
};

export const getIsRealmAnnexed = (realm: RealmFragmentFragment) => {
  return hasOwnRelic(realm) || realm?.realmId === getHolderOfRelic(realm);
};

export const getRelicsOwned = (realm: RealmFragmentFragment) => {
  return realm?.relicsOwned;
};

export function isLessThan10MinutesOld(timestamp) {
  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
  return timestamp > tenMinutesAgo;
}

export const filterFoodResources = (resources) => {
  return resources.filter(
    (r) =>
      r.resourceId != ResourcesIds.Fish && r.resourceId != ResourcesIds.Wheat
  );
};

export const getIsFood = (resourceId) => {
  return resourceId === ResourcesIds.Fish || resourceId === ResourcesIds.Wheat;
};

export function convertToK(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'm';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else if (isNaN(num)) {
    return 0;
  }

  return num.toFixed(2);
}

export const getStoreHouseSize = (food) => {
  return food ? food / STORE_HOUSE_SIZE : 0;
};

export const getTotalUsedSpace = (buildingSpace, storehouse) => {
  return buildingSpace ? buildingSpace + storehouse : storehouse;
};
