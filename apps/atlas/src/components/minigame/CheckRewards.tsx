import { useStarknet } from '@starknet-react/core';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useUserReward from '@/hooks/desiege/useUserReward';
import LoadingSkeleton from '@/shared/LoadingSkeleton';

type Prop = {
  initialGameIndex?: number;
};

const CheckRewards: React.FC<Prop> = (props) => {
  const { account, connectBrowserWallet } = useStarknet();
  const router = useRouter();
  const gameIdx = router.query['game_id']
    ? parseInt(router.query['game_id'] as string)
    : props.initialGameIndex;

  const userReward = useUserReward({ gameIdx, account });

  useEffect(() => {
    connectBrowserWallet();
  }, []);

  return (
    <div>
      <h3>Game {gameIdx}</h3>
      {userReward.loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <p>User alloc: {userReward.alloc?.toString()}</p>
          <p>{account}</p>
        </>
      )}
    </div>
  );
};

export default CheckRewards;
