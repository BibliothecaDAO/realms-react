import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import { useResourcesContext } from '@/context/ResourcesContext';
import type { GetGameConstantsQuery } from '@/generated/graphql';
import { useGetGameConstantsQuery } from '@/generated/graphql';

export const useGameConstants = () => {
  const { balance } = useResourcesContext();
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
    console.log(cost);
    const co = BigNumber.from(parseInt(cost).toFixed().toString());

    const baseBn = BigNumber.from('1000000000000000000').mul(co);

    const currentBalance =
      balance.find((a) => a.resourceId === id)?.amount || 0;

    return BigNumber.from(currentBalance).gte(baseBn) ? true : false;
  };

  const checkUserHasCheckoutResources = ({ cost, id }) => {
    const co = BigNumber.from(parseInt(cost).toFixed().toString());

    const baseBn = BigNumber.from('1000000000000000000').mul(co);

    const currentBalance =
      balance.find((a) => a.resourceId === parseInt(id))?.checkoutAmount || 0;

    return BigNumber.from(currentBalance).gte(baseBn) ? true : false;
  };

  return {
    gameConstants,
    checkUserHasAvailableResources,
    checkUserHasCheckoutResources,
    getBuildingCostById,
  };
};
