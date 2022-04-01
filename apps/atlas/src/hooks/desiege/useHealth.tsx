import type BN from 'bn.js';
import { useQuery } from 'react-query';
import { getMainHealth } from '@/util/minigameApi';

type UseHealthArgs = {
  gameIdx?: number;
};

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  mainHealth: (gameIdx: any) => ['desiege-health', gameIdx],
};

const useHealth = (args: UseHealthArgs) => {
  return useQuery<BN>(
    queryKeys.mainHealth(args.gameIdx),
    async () => {
      return await getMainHealth(args.gameIdx?.toString() as string);
    },
    {
      enabled: args.gameIdx !== undefined,
      refetchInterval: 1000 * 30, // 30 seconds
    }
  );
};

export default useHealth;
