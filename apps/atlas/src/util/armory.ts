import type { BattalionInterface } from '../types';

export const getCostSums = (battalion: BattalionInterface[]) => {
  /* const troopIds = squad?.map((a: TroopInterface) => {
    return a?.troopCost;
  });

  const resources = troopIds
    .map((a: any) => {
      return a.resources;
    })
    .flat();

  return resources.reduce((acc, curr) => {
    const index = acc.findIndex((item) => item.resourceId === curr.resourceId);
    index > -1
      ? (acc[index].amount += curr.amount)
      : acc.push({
          resourceId: curr.resourceId,
          amount: curr.amount,
        });
    return acc;
  }, []); */
  return [];
};
