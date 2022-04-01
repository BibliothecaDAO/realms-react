import type BN from 'bn.js';
import { useQuery } from 'react-query';
import { getTokenRewardPool } from '@/util/minigameApi';

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

const useTokenPool = (args: UseTokenPoolArgs) => {
  return useQuery<BN>(
    queryKeys.tokenPoolBalance(args.gameIdx, args.tokenId),
    () => getTokenRewardPool(args.gameIdx?.toString() as string, args.tokenId),
    {
      enabled: args.gameIdx !== undefined,
      refetchInterval: args.refetch ? 1000 * 30 : false, // 30 seconds
    }
  );
};

export default useTokenPool;
