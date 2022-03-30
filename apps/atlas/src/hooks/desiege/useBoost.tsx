import { useQuery } from 'react-query';
import { getCurrentBoost } from '@/util/minigameApi';

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  boost: ['desiege-boost'],
};

const useBoost = () => {
  return useQuery(queryKeys.boost, () => getCurrentBoost(), {
    // The boost is supposed to change every hour
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useBoost;
