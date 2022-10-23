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

  const checkUserHasResources = ({ cost, id }) => {
    const co = BigNumber.from((cost * 10 ** 18).toString());
    const currentBalance =
      balance.find((a) => a.resourceId === id)?.amount || 0;

    return BigNumber.from(currentBalance).gte(co) ? true : false;
  };

  return {
    gameConstants,
    checkUserHasResources,
    getBuildingCostById,
  };
};
