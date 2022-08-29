import { formatEther } from '@ethersproject/units';
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { useResourcesContext } from '@/context/ResourcesContext';
import type { GetGameConstantsQuery } from '@/generated/graphql';
import { useGetGameConstantsQuery } from '@/generated/graphql';

export const useCosts = () => {
  const { balance } = useResourcesContext();
  const [costs, setCosts] = useState<GetGameConstantsQuery>();

  const { data } = useGetGameConstantsQuery();

  useEffect(() => {
    if (!data) {
      return;
    }

    setCosts(data);
  }, [data]);

  const getBuildingCostById = (id) => {
    return costs?.buildingCosts.find((a) => a.buildingId === id);
  };

  const checkUserHasResources = ({ cost, id }) => {
    const currentBalance =
      balance.find((a) => a.resourceId === id)?.amount || 0;
    return toBN(currentBalance) >= toBN(cost) ? true : false;
  };

  return {
    costs,
    checkUserHasResources,
    getBuildingCostById,
  };
};
