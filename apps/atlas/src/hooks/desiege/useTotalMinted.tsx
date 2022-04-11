import { useQuery } from 'react-query';
import { getTotalElementsMinted } from '@/util/minigameApi';

type UseTotalMintedArgs = {
  gameIdx?: number;
};

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  totalMinted: (gameIdx: any) => ['desiege-tokens-minted-sum', gameIdx],
};

const useTotalMinted = (args: UseTotalMintedArgs) => {
  return useQuery<{ light: number; dark: number }>(
    queryKeys.totalMinted(args.gameIdx),
    () => getTotalElementsMinted(args.gameIdx as number),
    {
      enabled: args.gameIdx !== undefined,
      // The token pool needs to be retrieved once
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    }
  );
};

export default useTotalMinted;
