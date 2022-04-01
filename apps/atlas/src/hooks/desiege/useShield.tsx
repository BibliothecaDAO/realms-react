import type BN from 'bn.js';
import { useQuery } from 'react-query';
import { ElementToken } from '@/constants/index';
import { getShieldValue, TOKEN_INDEX_OFFSET_BASE } from '@/util/minigameApi';

type UseShieldArgs = {
  gameIdx?: number;
};

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  shield: (gameIdx: any) => ['desiege-game-shield', gameIdx],
};

const useShield = (args: UseShieldArgs) => {
  return useQuery<BN>(
    queryKeys.shield(args.gameIdx),
    () => {
      // The light token is the shield
      const tokenId =
        (args.gameIdx as number) * TOKEN_INDEX_OFFSET_BASE + ElementToken.Light;
      return getShieldValue(args.gameIdx?.toString() as string, tokenId);
    },
    {
      enabled: args.gameIdx !== undefined,
      refetchInterval: 1000 * 30, // 30 seconds
    }
  );
};

export default useShield;
