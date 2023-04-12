import type { Army, Bastion, BastionLocation } from '@/generated/graphql';

// eslint-disable-next-line @typescript-eslint/naming-convention
const BIG_BLOCK_NUMBER = 790000;

export function useGetBastionHistoryQuery(bastionId: number) {
  return {
    data: bastionEvents,
    loading: false,
    startPolling: (time: number) => time,
    stopPolling: () => {
      console.log('stop polling');
    },
  };
}

export type BastionHistory = {
  __typename?: 'BastionHistory';
  id: number;
  eventId?: string | null;
  eventType?: string | null;
  realmId: number;
  realmOwner?: string | null;
  data?: any | null;
  timestamp?: any | null;
  transactionHash?: string | null;
};

export type GetBastionHistoryQuery = {
  __typename?: 'Query';
  getBastionHistory: Array<{
    __typename?: 'BastionHistory';
    id: number;
    eventId?: string | null;
    eventType?: string | null;
    realmId: number;
    realmOwner?: string | null;
    data?: any | null;
    timestamp?: any | null;
    transactionHash?: string | null;
  }>;
};

const bastionEvents: GetBastionHistoryQuery = {
  __typename: 'Query',
  getBastionHistory: [
    Array(5).fill({
      id: 1,
      eventId: '03oije',
      eventType: 'bastion_combat',
      realmId: 1,
      realmOwner: '0x...3994',
      data: {
        success: true,
        defendRealmId: 2,
        locationId: 1,
      },
    }),
    Array(5).fill({
      id: 1,
      eventId: '03oije',
      eventType: 'bastion_take_location',
      realmId: 1,
      realmOwner: '0x...3994',
      data: {
        armyId: 1,
        order: 2,
        locationId: 1,
      },
    }),
    Array(5).fill({
      id: 1,
      eventId: '03oije',
      eventType: 'bastion_move',
      realmId: 1,
      realmOwner: '0x...3994',
      data: {
        armyId: 1,
        pastLocation: 1,
        nextLocation: 2,
      },
    }),
    Array(5).fill({
      id: 1,
      eventId: '03oije',
      eventType: 'bastion_army_travel',
      realmId: 1,
      realmOwner: '0x...3994',
      data: {
        armyId: 1,
        // arrival or departure from the bastion
        arrival: true,
        arrivalBlock: 789990,
      },
    }),
  ]
    .flat()
    .sort(() => 0.5 - Math.random()),
};

export function useGetBastionsQuery(bastionId: number) {
  return {
    data: { bastions: bastions },
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

const createArmy = (
  realmId: number,
  armyId: number,
  locationId: number,
  arrivalBlock: number,
  pastLocation: number,
  orderId: number
): Army => {
  return {
    orderId: orderId,
    bastionArrivalBlock: arrivalBlock,
    bastionPastLocation: pastLocation,
    bastionCurrentLocation: locationId,
    armyPacked: 0,
    callSign: 0,
    destinationRealmId: 0,
    level: 0,
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

const locations: BastionLocation[] = [
  {
    bastionId: 3711000,
    locationId: 0,
    defendingOrderId: 1,
    takenBlock: 1,
    armies: [
      // 262 is my realm id on testnet
      createArmy(262, 79, 0, 1, 1, 2),
      createArmy(262, 80, 0, 1, 1, 2),
      createArmy(2, 1, 0, 1, 1, 2),
      createArmy(2, 2, 0, 1, 1, 2),
      createArmy(3, 1, 0, 1, 1, 2),
      createArmy(2, 3, 0, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 4, 0, BIG_BLOCK_NUMBER, 1, 2),
    ],
  },
  {
    bastionId: 3711000,
    locationId: 1,
    defendingOrderId: 2,
    takenBlock: 1,
    armies: [
      createArmy(262, 2, 1, 1, 1, 1),
      createArmy(262, 4, 1, 1, 1, 1),
      createArmy(2, 3, 1, 1, 1, 1),
      createArmy(2, 4, 1, 1, 1, 3),
      createArmy(2, 5, 1, 1, 1, 4),
      createArmy(2, 6, 1, 1, 1, 6),
      createArmy(2, 7, 1, 1, 1, 7),
      createArmy(2, 8, 1, 1, 1, 8),
      createArmy(2, 9, 1, 1, 1, 9),
      createArmy(262, 3, 1, BIG_BLOCK_NUMBER, 1, 1),
      createArmy(2, 10, 1, BIG_BLOCK_NUMBER, 1, 10),
      createArmy(2, 11, 1, BIG_BLOCK_NUMBER, 1, 11),
      createArmy(2, 12, 1, BIG_BLOCK_NUMBER, 1, 12),
      createArmy(2, 13, 1, BIG_BLOCK_NUMBER, 1, 13),
      createArmy(2, 14, 1, BIG_BLOCK_NUMBER, 1, 14),
      createArmy(2, 15, 1, BIG_BLOCK_NUMBER, 1, 15),
      createArmy(2, 16, 1, BIG_BLOCK_NUMBER, 1, 16),
      createArmy(262, 2, 1, 2, 1, 2),
      createArmy(262, 4, 1, 2, 1, 2),
      createArmy(2, 3, 1, 2, 1, 2),
      createArmy(2, 4, 1, 2, 1, 2),
      createArmy(2, 5, 1, 2, 1, 2),
      createArmy(2, 6, 1, 2, 1, 2),
      createArmy(2, 7, 1, 2, 1, 2),
      createArmy(2, 8, 1, 2, 1, 2),
      createArmy(2, 9, 1, 2, 1, 2),
      createArmy(262, 3, 1, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 10, 1, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 11, 1, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 12, 1, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 13, 1, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 14, 1, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 15, 1, BIG_BLOCK_NUMBER, 1, 2),
      createArmy(2, 16, 1, BIG_BLOCK_NUMBER, 1, 2),
    ],
  },
  {
    bastionId: 3711000,
    locationId: 2,
    defendingOrderId: 2,
    takenBlock: 1,
    armies: [
      createArmy(262, 2, 2, 2, 1, 1),
      createArmy(262, 4, 2, 2, 1, 1),
      createArmy(2, 3, 2, 2, 1, 2),
      createArmy(2, 4, 2, 2, 1, 2),
      createArmy(2, 5, 2, 2, 1, 2),
      createArmy(2, 6, 2, 2, 1, 2),
      createArmy(2, 7, 2, 2, 1, 2),
      createArmy(2, 8, 2, 2, 1, 2),
      createArmy(2, 9, 2, 2, 1, 2),
    ],
  },
  {
    bastionId: 3711000,
    locationId: 3,
    defendingOrderId: 1,
    takenBlock: 1,
    armies: [
      createArmy(1, 3, 3, 1, 1, 1),
      createArmy(2, 3, 3, 1, 1, 2),
      createArmy(262, 3, 3, 1, 1, 2),
    ],
  },
  {
    bastionId: 3711000,
    locationId: 4,
    defendingOrderId: 0,
    takenBlock: 1,
    armies: [
      createArmy(262, 4, 4, 1, 1, 1),
      createArmy(2, 4, 4, 1, 1, 1),
      createArmy(9, 1, 4, 1, 1, 2),
    ],
  },
  {
    bastionId: 3711000,
    locationId: 5,
    defendingOrderId: 2,
    takenBlock: 1,
    armies: [
      createArmy(1, 5, 5, 1, 1, 1),
      createArmy(1, 6, 5, 1, 1, 2),
      createArmy(262, 30, 5, 1, 1, 1),
      createArmy(262, 31, 5, 1, 1, 1),
      createArmy(262, 32, 5, 1, 1, 1),
      createArmy(9, 1, 5, 1, 1, 4),
      createArmy(9, 2, 5, 1, 1, 4),
      createArmy(9, 3, 5, 1, 1, 4),
      createArmy(9, 4, 5, 1, 1, 4),
      createArmy(9, 5, 5, 1, 1, 4),
      createArmy(9, 6, 5, 1, 1, 4),
      createArmy(9, 7, 5, 1, 1, 4),
      createArmy(9, 8, 5, 1, 1, 4),
      createArmy(9, 9, 5, 1, 1, 4),
      createArmy(9, 10, 5, 1, 1, 4),
      createArmy(9, 11, 5, 1, 1, 4),
      createArmy(9, 12, 5, 1, 1, 4),
      createArmy(9, 13, 5, 1, 1, 4),
      createArmy(9, 14, 5, 1, 1, 4),
      createArmy(9, 15, 5, 1, 1, 4),
      createArmy(9, 16, 5, 1, 1, 4),
      createArmy(9, 17, 5, 1, 1, 4),
      createArmy(9, 18, 5, 1, 1, 4),
      createArmy(9, 19, 5, 1, 1, 4),
      createArmy(9, 20, 5, 1, 1, 4),
      createArmy(9, 21, 5, 1, 1, 4),
      createArmy(9, 22, 5, 1, 1, 4),
      createArmy(9, 23, 5, 1, 1, 4),
      createArmy(9, 24, 5, 1, 1, 4),
      createArmy(9, 25, 5, 1, 1, 4),
      createArmy(9, 26, 5, 1, 1, 4),
      createArmy(9, 27, 5, 1, 1, 4),
      createArmy(8, 18, 5, 1, 1, 2),
      createArmy(8, 19, 5, 1, 1, 2),
      createArmy(8, 20, 5, 1, 1, 2),
      createArmy(8, 21, 5, 1, 1, 2),
      createArmy(8, 22, 5, 1, 1, 2),
      createArmy(8, 23, 5, 1, 1, 2),
      createArmy(8, 24, 5, 1, 1, 2),
      createArmy(8, 25, 5, 1, 1, 2),
      createArmy(8, 26, 5, 1, 1, 2),
      createArmy(8, 27, 5, 1, 1, 2),
      createArmy(8, 28, 5, 1, 1, 2),
      createArmy(8, 29, 5, 1, 1, 2),
      createArmy(8, 30, 5, 1, 1, 2),
      createArmy(8, 31, 5, 1, 1, 2),
      createArmy(8, 32, 5, 1, 1, 2),
    ],
  },
];

// TODOBASTONS: how to get order from realm_id? use getRealmOrderById

const bastions: Bastion[] = [
  {
    bastionId: 3711000,
    longitude: -33,
    latitude: 30.78,
    locations: locations,
  },
  {
    bastionId: 3506800,
    longitude: -30,
    latitude: 20.68,
    locations: locations,
  },
];
