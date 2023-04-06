import { MovingTimes } from '@/constants/bastion';
import { SECONDS_PER_KM } from '@/constants/globals';
import type { Army, Bastion, GetRealmsQuery } from '@/generated/graphql';
import { normalizeOrderName, theOrders } from '../lore/theOrders';
import { getCoordinates } from '../realms/RealmsGetters';

export const getBastionLocation = (bastion: Bastion, locationId: number) => {
  const location = bastion.locations.find(
    (loc) => loc.locationId === locationId
  );
  if (!location) {
    return {
      locationId: locationId,
      defendingOrderId: 0,
      takenBlock: 0,
      armies: [],
    };
  } else {
    return location;
  }
};

export const getLocationArmies = (
  bastion: Bastion,
  locationId: number,
  defender: boolean,
  arrived: boolean,
  blockNumber: number
) => {
  const location = getBastionLocation(bastion, locationId);
  if (location && location.armies.length > 0) {
    if (arrived) {
      if (defender === true) {
        return location.armies.filter(
          (army) =>
            army.orderId === location.defendingOrderId &&
            army.bastionArrivalBlock <= blockNumber
        );
      } else {
        return location.armies.filter(
          (army) =>
            army.orderId !== location.defendingOrderId &&
            army.bastionArrivalBlock <= blockNumber
        );
      }
    } else {
      if (defender === true) {
        return location.armies.filter(
          (army) =>
            army.orderId === location.defendingOrderId &&
            army.bastionArrivalBlock > blockNumber
        );
      } else {
        return location.armies.filter(
          (army) =>
            army.orderId !== location.defendingOrderId &&
            army.bastionArrivalBlock > blockNumber
        );
      }
    }
  } else {
    return [];
  }
};

export const getAttackableArmies = (
  bastion: Bastion,
  locationId: number,
  attackingArmyOrder: number,
  blockNumber: number
) => {
  const location = getBastionLocation(bastion, locationId);
  if (locationId === 3) {
    console.log(attackingArmyOrder);
    console.log(blockNumber);
    console.log(location);
  }
  // if you are attacker, show the armies that are not your order
  const test = location.armies.filter(
    (army) =>
      // if you are attacker, show all the enemy order armies
      army.orderId !== attackingArmyOrder &&
      // needs to arrive to be attackable
      army.bastionArrivalBlock <= blockNumber
  );
  console.log(test);
  return test;
};

export const isUserArmy = (userRealms: GetRealmsQuery, army: Army): boolean => {
  if (!userRealms) return false;
  for (const realm of userRealms.realms) {
    if (realm.realmId === army.realmId) {
      return true;
    }
  }
  return false;
};

export const computeShowTakeLocation = (
  bastion: Bastion,
  locationId: number
) => {
  const location = getBastionLocation(bastion, locationId);
  const defendingOrder = location.defendingOrderId;
  if (
    location.armies.filter((army) => army.orderId === defendingOrder).length ===
    0
  ) {
    return true;
  } else {
    return defendingOrder === 0;
  }
};

export const getMoveTimes = (
  currentLocation: number,
  army: Army,
  bastion: Bastion
): { [location: number]: number } => {
  // eslint-disable-next-line sonarjs/no-unused-collection
  const movingTimes: { [location: number]: number } = {};
  const armyOrder = army.orderId;

  const isDefendingCurrentLocation =
    getBastionLocation(bastion, currentLocation).defendingOrderId === armyOrder;
  const hasCentralSquare =
    getBastionLocation(bastion, 5).defendingOrderId === army.orderId;
  const hasAllTowers =
    getBastionLocation(bastion, 1).defendingOrderId === armyOrder &&
    getBastionLocation(bastion, 2).defendingOrderId === armyOrder &&
    getBastionLocation(bastion, 3).defendingOrderId === armyOrder &&
    getBastionLocation(bastion, 4).defendingOrderId === armyOrder;

  if (currentLocation === 0) {
    movingTimes[1] = MovingTimes.DistanceStagingAreaTower;
    movingTimes[2] = MovingTimes.DistanceStagingAreaTower;
    movingTimes[3] = MovingTimes.DistanceStagingAreaTower;
    movingTimes[4] = MovingTimes.DistanceStagingAreaTower;
    if (hasCentralSquare && hasAllTowers) {
      movingTimes[5] = MovingTimes.DistanceStagingAreaCentralSquare;
    }
    // leave bastion
    movingTimes[6] = 999;
  }

  if (currentLocation === 1 || currentLocation === 3) {
    movingTimes[0] = MovingTimes.DistanceStagingAreaTower;
    movingTimes[2] = movingTimeToAdjacentTower(
      isDefendingCurrentLocation,
      2,
      armyOrder,
      bastion
    );
    movingTimes[4] = movingTimeToAdjacentTower(
      isDefendingCurrentLocation,
      4,
      armyOrder,
      bastion
    );
    if (hasCentralSquare) {
      movingTimes[5] = movingTimeFromTowerGateToCentralSquare(
        currentLocation,
        armyOrder,
        bastion
      );
    }
  }

  if (currentLocation === 2 || currentLocation === 4) {
    movingTimes[0] = MovingTimes.DistanceStagingAreaTower;
    movingTimes[3] = movingTimeToAdjacentTower(
      isDefendingCurrentLocation,
      3,
      armyOrder,
      bastion
    );
    movingTimes[1] = movingTimeToAdjacentTower(
      isDefendingCurrentLocation,
      1,
      armyOrder,
      bastion
    );
    if (hasCentralSquare) {
      movingTimes[5] = movingTimeFromTowerGateToCentralSquare(
        currentLocation,
        armyOrder,
        bastion
      );
    }
  }

  if (currentLocation === 5) {
    movingTimes[0] = MovingTimes.DistanceStagingAreaCentralSquare;
    movingTimes[1] =
      getBastionLocation(bastion, 1).defendingOrderId === armyOrder
        ? MovingTimes.DistanceTowerCentralSquare
        : MovingTimes.DistanceTowerInnerGate;
    movingTimes[2] =
      getBastionLocation(bastion, 2).defendingOrderId === armyOrder
        ? MovingTimes.DistanceTowerCentralSquare
        : MovingTimes.DistanceTowerInnerGate;
    movingTimes[3] =
      getBastionLocation(bastion, 3).defendingOrderId === armyOrder
        ? MovingTimes.DistanceTowerCentralSquare
        : MovingTimes.DistanceTowerInnerGate;
    movingTimes[4] =
      getBastionLocation(bastion, 4).defendingOrderId === armyOrder
        ? MovingTimes.DistanceTowerCentralSquare
        : MovingTimes.DistanceTowerInnerGate;
  }
  return movingTimes;
};

const movingTimeToAdjacentTower = (
  isDefendingCurrentLocation: boolean,
  adjacentTower: number,
  armyOrder: number,
  bastion: Bastion
) => {
  if (isDefendingCurrentLocation) {
    if (
      getBastionLocation(bastion, adjacentTower).defendingOrderId === armyOrder
    ) {
      return MovingTimes.DistanceTowerTower;
    } else {
      return MovingTimes.DistanceGateTower;
    }
  } else {
    return MovingTimes.DistanceGateGate;
  }
};

const movingTimeFromTowerGateToCentralSquare = (
  currentLocation: number,
  armyOrder: number,
  bastion: Bastion
): number => {
  if (
    getBastionLocation(bastion, 5).defendingOrderId === armyOrder &&
    getBastionLocation(bastion, currentLocation).defendingOrderId === armyOrder
  ) {
    return MovingTimes.DistanceTowerCentralSquare;
  } else {
    if (currentLocation === 1 || currentLocation === 3) {
      if (
        getBastionLocation(bastion, 4).defendingOrderId === armyOrder ||
        getBastionLocation(bastion, 2).defendingOrderId === armyOrder
      ) {
        return (
          MovingTimes.DistanceGateTower + MovingTimes.DistanceTowerCentralSquare
        );
      } else {
        return (
          MovingTimes.DistanceGateGate +
          MovingTimes.DistanceGateTower +
          MovingTimes.DistanceTowerCentralSquare
        );
      }
    } else {
      if (
        getBastionLocation(bastion, 3).defendingOrderId === armyOrder ||
        getBastionLocation(bastion, 1).defendingOrderId === armyOrder
      ) {
        return (
          MovingTimes.DistanceGateTower + MovingTimes.DistanceTowerCentralSquare
        );
      } else {
        return (
          MovingTimes.DistanceGateGate +
          MovingTimes.DistanceGateTower +
          MovingTimes.DistanceTowerCentralSquare
        );
      }
    }
  }
};

export const getBastionTravelTime = ({ travellerId, bastion }) => {
  const distance = (x1, y1, x2, y2) => {
    const a = x1 - x2;
    const b = y1 - y2;

    return Math.sqrt(a * a + b * b);
  };

  const travellerCoordinates = getCoordinates(travellerId);
  const destinationCoordinates = { xy: [bastion.longitude, bastion.latitude] };

  const d = distance(
    travellerCoordinates?.xy[0],
    travellerCoordinates?.xy[1],
    destinationCoordinates?.xy[0],
    destinationCoordinates?.xy[1]
  ).toFixed(2);

  return { distance: d, time: parseInt(d) * SECONDS_PER_KM };
};

export function filterArmiesThatCannotTravel(
  userRealms: GetRealmsQuery,
  bastion: Bastion
): GetRealmsQuery {
  const newRealms: typeof userRealms = {
    __typename: 'Query',
    total: userRealms.total,
    realms: userRealms.realms.map((realm) => ({
      ...realm,
      ownArmies: realm.ownArmies.filter((army) => {
        if (army.armyId === 0) {
          return false;
        } else {
          const inBastion = bastion.locations.some((loc) => {
            const matchingArmy = loc.armies.find(
              (a) => a.armyId === army.armyId && a.realmId === army.realmId
            );
            return matchingArmy !== undefined;
          });
          return !inBastion;
        }
      }),
    })),
  };
  return newRealms;
}

export function addTravelTime(userRealms: GetRealmsQuery, bastion: Bastion) {
  return userRealms.realms.flatMap((realm) => {
    return realm.ownArmies.map((army) => {
      const travelTime = getBastionTravelTime({
        travellerId: realm.realmId,
        bastion: bastion,
      });
      return {
        realmName: realm ? (realm.name as string) : '',
        realmId: realm.realmId,
        armyId: army.armyId,
        ...travelTime,
      };
    });
  });
}

export const getOrderForColor = (orderId: number) => {
  const order = orderId ? theOrders[orderId - 1].name.toLowerCase() : undefined;
  if (order) {
    return normalizeOrderName(order);
  }
};
export function getTimeDifferenceInHours(timestamp: number): number {
  const currentTime = new Date().getTime();
  const timestampTime = new Date(timestamp).getTime();
  const differenceInMilliseconds = currentTime - timestampTime;
  return Math.round(differenceInMilliseconds / (1000 * 60 * 60));
}
