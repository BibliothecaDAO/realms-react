import type { Scalars } from '@/generated/graphql';

// eslint-disable-next-line @typescript-eslint/naming-convention
const BIG_BLOCK_NUMBER = 10 * 10 ** 10;

export function useGetBastionsQuery(bastionId: number) {
  return {
    data: bastions.find((a) => a.bastionId == bastionId),
    loading: false,
    startPolling: (time: number) => time,
    stopPolling: () => {
      console.log('stop polling');
    },
  };
}

function getRandomInt(): number {
  return Math.floor(Math.random() * 101);
}

type Army = {
  __typename?: 'Army';
  // TODOBASTIONS: verify the format of order id from indexer
  orderId: Scalars['Int'];
  realmId: Scalars['Int'];
  armyId: Scalars['Int'];
  arcanistHealth: Scalars['Int'];
  arcanistQty: Scalars['Int'];
  archerHealth: Scalars['Int'];
  archerQty: Scalars['Int'];
  heavyCavalryHealth: Scalars['Int'];
  heavyCavalryQty: Scalars['Int'];
  heavyInfantryHealth: Scalars['Int'];
  heavyInfantryQty: Scalars['Int'];
  lightCavalryHealth: Scalars['Int'];
  lightCavalryQty: Scalars['Int'];
  lightInfantryHealth: Scalars['Int'];
  lightInfantryQty: Scalars['Int'];
  longbowHealth: Scalars['Int'];
  longbowQty: Scalars['Int'];
  mageHealth: Scalars['Int'];
  mageQty: Scalars['Int'];
  xp: Scalars['Int'];
};

const createArmy = (
  realmId: number,
  armyId: number,
  arrivalBlock: number,
  pastLocation: number,
  orderId: number
): BastionArmy => {
  return {
    orderId: orderId,
    arrivalBlock: arrivalBlock,
    pastLocation: pastLocation,
    realmId: realmId,
    armyId: armyId,
    arcanistHealth: getRandomInt(),
    arcanistQty: getRandomInt(),
    archerHealth: getRandomInt(),
    archerQty: getRandomInt(),
    heavyCavalryHealth: getRandomInt(),
    heavyCavalryQty: getRandomInt(),
    heavyInfantryHealth: getRandomInt(),
    heavyInfantryQty: getRandomInt(),
    lightCavalryHealth: getRandomInt(),
    lightCavalryQty: getRandomInt(),
    lightInfantryHealth: getRandomInt(),
    lightInfantryQty: getRandomInt(),
    longbowHealth: getRandomInt(),
    longbowQty: getRandomInt(),
    mageHealth: getRandomInt(),
    mageQty: getRandomInt(),
    xp: 1,
  };
};

export type BastionArmy = Army & {
  arrivalBlock: Scalars['Int'];
  pastLocation: Scalars['Int'];
};

type Location = {
  locationId: Scalars['Int'];
  defendingOrderId: Scalars['Int'];
  takenBlock: Scalars['Int'];
  armies: BastionArmy[];
};

export type Bastion = {
  bastionId: Scalars['Int'];
  longitude: Scalars['Float'];
  latitude: Scalars['Float'];
  locations: Location[];
};

// order 2 = giants (realm 1)
// order 5 = Perfection (realm 2)
// realm 9 is order of fury
const locations: Location[] = [
  {
    locationId: 0,
    defendingOrderId: 1,
    takenBlock: 1,
    armies: [
      // 262 is my realm id on testnet
      createArmy(262, 79, 1, 1, 2),
      createArmy(262, 80, 1, 1, 2),
      createArmy(2, 1, 1, 1, 2),
      createArmy(2, 2, 1, 1, 2),
      createArmy(2, 3, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 4, BIG_BLOCK_NUMBER, 1, 2),
    ],
  },
  {
    locationId: 1,
    defendingOrderId: 2,
    takenBlock: 1,
    armies: [
      createArmy(262, 2, 1, 1, 1),
      createArmy(262, 4, 1, 1, 1),
      createArmy(2, 3, 1, 1, 1),
      createArmy(2, 4, 1, 1, 3),
      createArmy(2, 5, 1, 1, 4),
      createArmy(2, 6, 1, 1, 6),
      createArmy(2, 7, 1, 1, 7),
      createArmy(2, 8, 1, 1, 8),
      createArmy(2, 9, 1, 1, 9),
      createArmy(262, 3, BIG_BLOCK_NUMBER, 1, 1),
      createArmy(2, 10, BIG_BLOCK_NUMBER, 1, 10),
      createArmy(2, 11, BIG_BLOCK_NUMBER, 1, 11),
      createArmy(2, 12, BIG_BLOCK_NUMBER, 1, 12),
      createArmy(2, 13, BIG_BLOCK_NUMBER, 1, 13),
      createArmy(2, 14, BIG_BLOCK_NUMBER, 1, 14),
      createArmy(2, 15, BIG_BLOCK_NUMBER, 1, 15),
      createArmy(2, 16, BIG_BLOCK_NUMBER, 1, 16),
      createArmy(262, 2, 2, 1, 2),
      createArmy(262, 4, 2, 1, 2),
      createArmy(2, 3, 2, 1, 2),
      createArmy(2, 4, 2, 1, 2),
      createArmy(2, 5, 2, 1, 2),
      createArmy(2, 6, 2, 1, 2),
      createArmy(2, 7, 2, 1, 2),
      createArmy(2, 8, 2, 1, 2),
      createArmy(2, 9, 2, 1, 2),
      createArmy(262, 3, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 10, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 11, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 12, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 13, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 14, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 15, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 16, BIG_BLOCK_NUMBER, 1, 2),
    ],
  },
  {
    locationId: 2,
    defendingOrderId: 2,
    takenBlock: 1,
    armies: [
      createArmy(262, 2, 2, 1, 1),
      createArmy(262, 4, 2, 1, 1),
      createArmy(2, 3, 2, 1, 2),
      createArmy(2, 4, 2, 1, 2),
      createArmy(2, 5, 2, 1, 2),
      createArmy(2, 6, 2, 1, 2),
      createArmy(2, 7, 2, 1, 2),
      createArmy(2, 8, 2, 1, 2),
      createArmy(2, 9, 2, 1, 2),
    ],
  },
  {
    locationId: 3,
    defendingOrderId: 1,
    takenBlock: 1,
    armies: [createArmy(1, 3, 1, 1, 1), createArmy(2, 3, 1, 1, 2)],
  },
  {
    locationId: 4,
    defendingOrderId: 0,
    takenBlock: 1,
    armies: [
      createArmy(262, 4, 1, 1, 1),
      createArmy(2, 4, 1, 1, 1),
      createArmy(9, 1, 1, 1, 2),
    ],
  },
  {
    locationId: 5,
    defendingOrderId: 2,
    takenBlock: 1,
    armies: [
      createArmy(1, 5, 1, 1, 1),
      createArmy(1, 6, 1, 1, 2),
      createArmy(262, 30, 1, 1, 1),
      createArmy(262, 31, 1, 1, 1),
      createArmy(262, 32, 1, 1, 1),
      createArmy(9, 1, 1, 1, 4),
      createArmy(9, 2, 1, 1, 4),
      createArmy(9, 3, 1, 1, 4),
      createArmy(9, 4, 1, 1, 4),
      createArmy(9, 5, 1, 1, 4),
      createArmy(9, 6, 1, 1, 4),
      createArmy(9, 7, 1, 1, 4),
      createArmy(9, 8, 1, 1, 4),
      createArmy(9, 9, 1, 1, 4),
      createArmy(9, 10, 1, 1, 4),
      createArmy(9, 11, 1, 1, 4),
      createArmy(9, 12, 1, 1, 4),
      createArmy(9, 13, 1, 1, 4),
      createArmy(9, 14, 1, 1, 4),
      createArmy(9, 15, 1, 1, 4),
      createArmy(9, 16, 1, 1, 4),
      createArmy(9, 17, 1, 1, 4),
      createArmy(9, 18, 1, 1, 4),
      createArmy(9, 19, 1, 1, 4),
      createArmy(9, 20, 1, 1, 4),
      createArmy(9, 21, 1, 1, 4),
      createArmy(9, 22, 1, 1, 4),
      createArmy(9, 23, 1, 1, 4),
      createArmy(9, 24, 1, 1, 4),
      createArmy(9, 25, 1, 1, 4),
      createArmy(9, 26, 1, 1, 4),
      createArmy(9, 27, 1, 1, 4),
      createArmy(8, 18, 1, 1, 2),
      createArmy(8, 19, 1, 1, 2),
      createArmy(8, 20, 1, 1, 2),
      createArmy(8, 21, 1, 1, 2),
      createArmy(8, 22, 1, 1, 2),
      createArmy(8, 23, 1, 1, 2),
      createArmy(8, 24, 1, 1, 2),
      createArmy(8, 25, 1, 1, 2),
      createArmy(8, 26, 1, 1, 2),
      createArmy(8, 27, 1, 1, 2),
      createArmy(8, 28, 1, 1, 2),
      createArmy(8, 29, 1, 1, 2),
      createArmy(8, 30, 1, 1, 2),
      createArmy(8, 31, 1, 1, 2),
      createArmy(8, 32, 1, 1, 2),
    ],
  },
];

// TODOBASTONS: how to get order from realm_id? use getRealmOrderById

const bastions: Bastion[] = [
  {
    bastionId: 3506800,
    longitude: -30,
    latitude: 20.68,
    locations: locations,
  },
  {
    bastionId: 3711000,
    longitude: -33,
    latitude: 30.78,
    locations: locations,
  },
];
