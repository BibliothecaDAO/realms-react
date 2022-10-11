import { useQuery } from 'react-query';
import { getCurrentBoost } from '@/util/minigameApi';
import useGameStatus from './useGameStatus';
import useGameVariables from './useGameVariables';

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  boost: ['desiege-boost'],
};

const useBoost = () => {
  const interval = 1000 * 60 * 5;
  const gameVars = useGameVariables();
  const gameStatus = useGameStatus({ gameIdx: gameVars.data?.gameIdx });

  return useQuery(queryKeys.boost, () => getCurrentBoost(), {
    // The boost should change every hour. 5 minutes is enough to display the value in semi real-time.
    refetchInterval: interval,
    staleTime: interval, // 5 minutes
    // even if tab is in background
    refetchIntervalInBackground: true,
    // Only fetch if game is active
    enabled: gameStatus.data === 'active',
  });
};

export default useBoost;
