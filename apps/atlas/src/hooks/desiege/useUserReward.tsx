import type BN from 'bn.js';
import { useQuery } from 'react-query';
import { toBN } from 'starknet/dist/utils/number';
import { getUserRewardAlloc, ShieldGameRole } from '@/util/minigameApi';
import useHealth from './useHealth';

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  userRewardAlloc: (account: any, gameIdx: any) => [
    'desiege-user-reward',
    account,
    gameIdx,
  ],
};

type UseUserRewardArgs = {
  gameIdx?: number;
  account?: string;
};

const useUserReward = (args: UseUserRewardArgs) => {
  const getMainHealth = useHealth({
    gameIdx: args.gameIdx,
  });

  let gameWinningSide: string | undefined;
  if (getMainHealth.data && getMainHealth.data.toNumber() > 0) {
    gameWinningSide = 'light';
  } else {
    gameWinningSide = 'dark';
  }

  const getUserReward = useQuery<BN>(
    queryKeys.userRewardAlloc(args.account, args.gameIdx),
    () => {
      return getUserRewardAlloc(
        args.gameIdx?.toString() as string,
        toBN(args.account as string).toString(),
        gameWinningSide == 'light'
          ? ShieldGameRole.Shielder
          : ShieldGameRole.Attacker
      );
    },
    {
      enabled:
        args.gameIdx !== undefined &&
        args.account !== undefined &&
        gameWinningSide !== undefined,
    }
  );

  return {
    loading: getUserReward.isLoading || getMainHealth.isLoading,
    alloc: getUserReward.data,
  };
};

export default useUserReward;
