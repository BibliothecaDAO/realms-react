import { parseEther } from '@ethersproject/units';
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
    const co = parseEther(String(cost));

    const currentBalance =
      balance.find((a) => a.resourceId === id)?.amount || 0;

    return BigNumber.from(currentBalance).gte(co) ? true : false;
  };

  const checkUserHasCheckoutResources = ({ cost, id }) => {
    const co = parseEther(String(cost));

    const currentBalance =
      balance.find((a) => a.resourceId === parseInt(id))?.checkoutAmount || 0;

    return BigNumber.from(currentBalance).gte(co) ? true : false;
  };

  return {
    gameConstants,
    checkUserHasAvailableResources,
    checkUserHasCheckoutResources,
    getBuildingCostById,
  };
};
