import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useUserBalancesContext } from '@/context/UserBalancesContext';
import type { GetGameConstantsQuery } from '@/generated/graphql';
import { useGetGameConstantsQuery } from '@/generated/graphql';

// TODO this should be refactored (doesnt need user balances for getting constants)
export const useGameConstants = () => {
  const { balance } = useUserBalancesContext();
  const [gameConstants, setGameConstants] = useState<GetGameConstantsQuery>();

  const { data } = useGetGameConstantsQuery();

  useEffect(() => {
    if (!data) {
      return;
    }

    setGameConstants(data);
  }, [data]);

  const getBuildingCostById = (id) => {
    return gameConstants?.buildingCosts.find((a) => a.buildingId === id);
  };

  const checkUserHasAvailableResources = ({ cost, id }) => {
    const co = BigNumber.from(Math.ceil(cost).toFixed().toString());

    const baseBn = BigNumber.from('1000000000000000000').mul(co);

    const currentBalance =
      balance.find((a) => a.resourceId === id)?.amount || 0;

    return BigNumber.from(currentBalance).gte(baseBn) ? true : false;
  };

  const checkUserHasCheckoutResources = ({ cost, id }) => {
    const co = BigNumber.from(Math.ceil(cost).toFixed().toString());

    const baseBn = BigNumber.from('1000000000000000000').mul(co);

    const currentBalance =
      balance.find((a) => a.resourceId === parseInt(id))?.checkoutAmount || 0;
    console.log(
      balance.find((a) => a.resourceId === parseInt(id))?.resourceName,
      balance.find((a) => a.resourceId === parseInt(id))?.checkoutAmount,
      cost,
      BigNumber.from(currentBalance).gte(baseBn) ? true : false
    );
    return BigNumber.from(currentBalance).gte(baseBn) ? true : false;
  };

  return {
    gameConstants,
    checkUserHasAvailableResources,
    checkUserHasCheckoutResources,
    getBuildingCostById,
  };
};
