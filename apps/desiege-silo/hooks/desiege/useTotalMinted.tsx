import { useQuery } from 'react-query';
import { getTotalElementsMinted } from '@/util/minigameApi';
import useGameStatus from './useGameStatus';

type UseTotalMintedArgs = {
  gameIdx?: number;
};

// https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
export const queryKeys = {
  totalMinted: (gameIdx: any) => ['desiege-tokens-minted-sum', gameIdx],
};

const useTotalMinted = (args: UseTotalMintedArgs) => {
  const gameStatus = useGameStatus({ gameIdx: args.gameIdx });

  const waitingInLobby =
    gameStatus.data == 'expired' || gameStatus.data == 'completed';

  return useQuery<{ light: number; dark: number }>(
    queryKeys.totalMinted(args.gameIdx),
    () => getTotalElementsMinted(args.gameIdx as number),
    {
      enabled: args.gameIdx !== undefined,
      staleTime: 1000 * 60 * (waitingInLobby ? 5 : 60 * 24), // 5 minutes for expired games, 24 hours for active games
      refetchOnWindowFocus: waitingInLobby,
    }
  );
};

export default useTotalMinted;
