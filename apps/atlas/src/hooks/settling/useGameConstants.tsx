import { useEffect, useState } from 'react';
import type { GetGameConstantsQuery } from '@/generated/graphql';
import { useGetGameConstantsQuery } from '@/generated/graphql';

export const useGameConstants = () => {
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

  return {
    gameConstants,
    getBuildingCostById,
  };
};
