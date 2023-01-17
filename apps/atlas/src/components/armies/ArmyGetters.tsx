export const hasArrived = (army) =>
  army?.destinationArrivalTime > new Date().getTime();

export const armyLocation = (army) =>
  army.destinationRealmId == 0 ? army.realmId : army.destinationRealmId;
