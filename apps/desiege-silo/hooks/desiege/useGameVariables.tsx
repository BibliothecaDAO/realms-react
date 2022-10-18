import { useQuery, useQueryClient } from 'react-query';
import { getGameContextVariables } from '@/util/minigameApi';

import { queryKeys as healthQueries } from './useHealth';

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  gameVariables: ['desiege-game-variables'],
};

const useGameVariables = () => {
  // Access the client
  const queryClient = useQueryClient();

  return useQuery(
    queryKeys.gameVariables,
    async () => {
      const gameVars = await getGameContextVariables();

      // Pre-populate the cache since we already have the data.
      queryClient.setQueryData(
        healthQueries.mainHealth(gameVars.gameIdx),
        gameVars.mainHealth
      );
      return gameVars;
    },
    {
      refetchOnMount: false,
      // This is only used one time at the start of the game.
      // Thereafter, individual queries are used to update the cache.
      staleTime: Infinity,
    }
  );
};

export default useGameVariables;
