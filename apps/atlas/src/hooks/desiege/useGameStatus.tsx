import { useQuery } from 'react-query';
import type { GameStatus } from '@/types/index';
import { getGameStatus } from '@/util/minigameApi';

type UseGameStatusArgs = {
  gameIdx?: number;
};

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  gameStatus: (gameIdx: any) => ['desiege-game-status', gameIdx],
};

const useGameStatus = (args: UseGameStatusArgs) => {
  return useQuery<GameStatus>(
    queryKeys.gameStatus(args.gameIdx),
    () => getGameStatus(args.gameIdx?.toString() as string),
    {
      enabled: args.gameIdx !== undefined,
      refetchOnMount: false,
      // When game starts, we need to poll the server for the game status
      // to change the UI. 1 minute is short enough and long enough to not hit the gateway too often.
      refetchInterval: 1000 * 60,
      staleTime: 1000 * 60, // 1 minute
    }
  );
};

export default useGameStatus;
