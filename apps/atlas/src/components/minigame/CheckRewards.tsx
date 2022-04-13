import { useStarknet } from '@starknet-react/core';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useGameStatus from '@/hooks/desiege/useGameStatus';
import useUserReward from '@/hooks/desiege/useUserReward';
import Button from '@/shared/Button';
import LoadingSkeleton from '@/shared/LoadingSkeleton';

type Prop = {
  initialGameIndex?: number;
};

const CheckRewards: React.FC<Prop> = (props) => {
  const { account, connectBrowserWallet } = useStarknet();
  const [editingGameNumber, setEditingGameNumber] = useState(false);
  const router = useRouter();
  const initialGameIndex = router.query['game_id']
    ? parseInt(router.query['game_id'] as string)
    : props.initialGameIndex;

  const [gameIdx, setGameIdx] = useState<number | undefined>(initialGameIndex);

  const gameStatus = useGameStatus({ gameIdx });

  const userReward = useUserReward({ gameIdx, account });

  useEffect(() => {
    connectBrowserWallet();
  }, []);

  const season = 'DivineEclipse';

  return (
    <div className="text-2xl">
      <h3 className="my-2">
        Contribution for Game{' '}
        {editingGameNumber ? (
          <input
            className="inline-block w-16 px-2 mx-2 text-black"
            placeholder="Game Number"
            type="text"
            value={gameIdx?.toString()}
            onChange={(e) =>
              setGameIdx(e.target.value ? parseInt(e.target.value) : undefined)
            }
          />
        ) : (
          gameIdx
        )}
        <button
          onClick={() => setEditingGameNumber((prev) => !prev)}
          className="p-1 text-xs text-blue-400 underline uppercase rounded-sm border-blue-50"
        >
          {editingGameNumber ? 'Close' : 'Edit'}
        </button>
      </h3>
      {gameStatus.data == 'active' ? (
        <p>
          This game is currently active. Check back later when the game
          finishes.
        </p>
      ) : (
        <>
          {userReward.loading ? (
            <LoadingSkeleton className="h-10" />
          ) : (
            <>
              <p>
                Siege contribution allocation:{' '}
                <span className="text-4xl">{userReward.alloc?.toString()}</span>
              </p>
              <p>Your StarkNet account: {account}</p>
            </>
          )}

          <div
            className={classNames(
              'p-4 mt-2 text-gray-800 bg-gray-100/70 rounded-lg',
              userReward.loading ? 'animate-pulse' : null
            )}
          >
            {userReward.alloc && userReward.alloc.toNumber() > 0 ? (
              <>
                <h2>You have contributed to victory!</h2> You can claim with
                this account for something in the future...
                <Button className="mt-2" disabled>
                  Claim
                </Button>
              </>
            ) : null}

            {userReward.alloc && userReward.alloc.toNumber() == 0 ? (
              <>
                <h2>Forces were too strong...</h2>
                You have cast your spells valiantly but the Elemental forces
                were too overwhelming.
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

export default CheckRewards;
