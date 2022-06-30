import { useStarknet } from '@starknet-react/core';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useGameStatus from '@/hooks/desiege/useGameStatus';
import useUserReward from '@/hooks/desiege/useUserReward';
import Button from '@/shared/Button';
import LoadingSkeleton from '@/shared/LoadingSkeleton';
import { shortenAddressWidth } from '@/util/formatters';
import VictoryDisplay from './VictoryDisplay';

type Prop = {
  initialGameIndex?: number;
};

const CheckRewards: React.FC<Prop> = (props) => {
  const { account } = useStarknet();
  const [editingGameNumber, setEditingGameNumber] = useState(false);
  const router = useRouter();
  const initialGameIndex = router.query['game_id']
    ? parseInt(router.query['game_id'] as string)
    : props.initialGameIndex;

  const [gameIdx, setGameIdx] = useState<number | undefined>(initialGameIndex);

  const gameStatus = useGameStatus({ gameIdx });

  const userReward = useUserReward({ gameIdx, account });

  return (
    <div className="text-2xl">
      <h3 className="my-2">
        Game{' '}
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
              <VictoryDisplay gameIdx={gameIdx} />
            </>
          )}

          <div
            className={classNames(
              'p-4 mt-2 text-gray-800 bg-gray-100/70 rounded-lg',
              userReward.loading ? 'animate-pulse' : null
            )}
          >
            <div className="flex justify-between mb-4">
              <div className="flex-grow">
                Game Receipt for:{' '}
                <pre> {shortenAddressWidth(account || '', 6)}</pre>
              </div>
              <div>
                Siege victory contribution:{' '}
                <span className="text-4xl">{userReward.alloc?.toString()}</span>
              </div>
            </div>

            {userReward.alloc && userReward.alloc.toNumber() > 0 ? (
              <>
                <h2>Contributed to victory!</h2> With this receipt, you can
                claim something in the future.
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
