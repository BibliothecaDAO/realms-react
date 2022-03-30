import { useStarknet } from '@starknet-react/core';

import type BN from 'bn.js';
import { useQuery } from 'react-query';
import { toBN } from 'starknet/dist/utils/number';
import {
  getTokenIdsForGame,
  ELEMENTS_ADDRESS,
  provider,
} from '@/util/minigameApi';

type UseTokenBalancesArgs = {
  gameIdx?: number;
};

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  tokenBalance: (gameIdx: any) => ['desiege-account-token-balance', gameIdx],
};

export const useTokenBalances = (args: UseTokenBalancesArgs) => {
  const starknet = useStarknet();

  const getBalance = useQuery<{ balances: BN[]; side: string }>(
    queryKeys.tokenBalance(args.gameIdx),
    async () => {
      // The token IDs change every game
      const tokenIds = getTokenIdsForGame(args.gameIdx as number);

      const ownerAddressInt = toBN(starknet.account as string).toString();
      const balances = await provider.callContract({
        contractAddress: ELEMENTS_ADDRESS,
        entrypoint: 'balanceOfBatch',
        calldata: [
          '2', // Owners length
          ownerAddressInt,
          ownerAddressInt, // ...again
          '2', // Token IDs length
          ...tokenIds.map((tid) => tid.toString()), // Token IDs
        ],
      });
      // Discard the length which is the first value
      balances.result.shift();
      const balancesBN = balances.result.map((bs) => toBN(bs));
      let side;
      const first = balancesBN[0];
      const second = balancesBN[1];

      if (first.gt(second)) {
        side = 'light';
      } else if (second.gt(first)) {
        side = 'dark';
      }
      return {
        balances: balancesBN,
        side,
      };
    },
    {
      enabled: args.gameIdx !== undefined && starknet.account !== undefined,
    }
  );

  return {
    loading: getBalance.isLoading,
    side: getBalance.data?.side,
    tokenBalances: getBalance.data?.balances,
    error: getBalance.error,
  };
};
