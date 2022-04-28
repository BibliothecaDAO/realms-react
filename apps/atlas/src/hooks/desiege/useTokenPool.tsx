import type BN from 'bn.js';
import { useQuery } from 'react-query';
import { getTokenRewardPool } from '@/util/minigameApi';
import useGameStatus from './useGameStatus';
import useGameVariables from './useGameVariables';

type UseTokenPoolArgs = {
  gameIdx?: number;
  tokenId: number;
  refetch?: boolean;
};

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  tokenPoolBalance: (gameIdx: any, tokenId: any) => [
    'desiege-token-pool',
    gameIdx,
    tokenId,
  ],
};

/*
 * Hook to query how many tokens have been used for the provided game (in the pool).
 */
const useTokenPool = (args: UseTokenPoolArgs) => {
  const gameVars = useGameVariables();
  const gameStatus = useGameStatus({ gameIdx: gameVars.data?.gameIdx });

  return useQuery<BN>(
    queryKeys.tokenPoolBalance(args.gameIdx, args.tokenId),
    () => getTokenRewardPool(args.gameIdx?.toString() as string, args.tokenId),
    {
      // Token pool is not needed unless game is active
      enabled: args.gameIdx !== undefined && gameStatus.data === 'active',
      // The token pool is used to indicate how many tokens are remaining in the game.
      // The staleTime and refetchInterval needs to be short enough to display values in semi real-time.
      staleTime: 1000 * 60, // 1 minute,
      refetchInterval: args.refetch ? 1000 * 60 : false, // 1 minute
    }
  );
};

export default useTokenPool;
