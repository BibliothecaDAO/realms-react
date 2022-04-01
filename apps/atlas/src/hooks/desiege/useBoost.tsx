import { useQuery } from 'react-query';
import { getCurrentBoost } from '@/util/minigameApi';

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  boost: ['desiege-boost'],
};

const useBoost = () => {
  const interval = 1000 * 60 * 5;
  return useQuery(queryKeys.boost, () => getCurrentBoost(), {
    // Fetch the boost automatically every hour
    refetchInterval: interval,
    // even if tab is in background
    refetchIntervalInBackground: true,
  });
};

export default useBoost;
