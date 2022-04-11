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
    }
  );
};

export default useGameStatus;
