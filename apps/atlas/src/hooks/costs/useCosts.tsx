import { formatEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
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
    const co = BigNumber.from((cost * 10 ** 18).toString());
    const currentBalance =
      balance.find((a) => a.resourceId === id)?.amount || 0;
    return BigNumber.from(currentBalance).gte(co) ? true : false;
  };

  return {
    costs,
    checkUserHasResources,
    getBuildingCostById,
  };
};
