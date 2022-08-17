import { useEffect, useState } from 'react';
import type { GetGameConstantsQuery } from '@/generated/graphql';
import { useGetGameConstantsQuery } from '@/generated/graphql';

export const useCosts = () => {
  const [costs, setCosts] = useState<GetGameConstantsQuery>();

  const { data } = useGetGameConstantsQuery();

  useEffect(() => {
    if (!data) {
      return;
    }

    setCosts(data);
  }, [data]);

  return {
    costs,
  };
};
