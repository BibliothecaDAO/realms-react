import type BN from 'bn.js';
import { useQuery } from 'react-query';
import { getTokenRewardPool } from '@/util/minigameApi';

type UseTokenPoolArgs = {
  gameIdx?: number;
  tokenId: number;
};

export const QUERY_KEY_PREFIX = 'desiege-token-pool';

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
    }
  );
};

export default useTokenPool;
