import { LightningBoltIcon } from '@heroicons/react/outline';
import { useSpring, animated, config } from 'react-spring';
import { ElementToken } from '@/constants/index';
import useGameStatus from '@/hooks/desiege/useGameStatus';
import useGameVariables from '@/hooks/desiege/useGameVariables';
import useTokenPool from '@/hooks/desiege/useTokenPool';
import useTotalMinted from '@/hooks/desiege/useTotalMinted';
import {
  EFFECT_BASE_FACTOR,
  TOKEN_INDEX_OFFSET_BASE,
} from '@/util/minigameApi';
interface Props {
  side: 'light' | 'dark';
}

const lightColours = 'from-rose-500 via-blue-600 to-rose-400';
const darkColours = 'from-rose-500 via-violet-900 to-rose-800';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const ManaBall = (props: Props) => {
  const getGameVars = useGameVariables();
  const getGameStatus = useGameStatus({
    gameIdx: getGameVars.data?.gameIdx,
  });

  // If the game is active, use the current game index.
  // Else the balls should show the total minted for the next game
  let gameIdx;
  if (getGameVars.data && getGameStatus.data) {
    if (getGameStatus.data == 'active') {
      gameIdx = getGameVars.data.gameIdx;
    } else {
      gameIdx = getGameVars.data.gameIdx + 1;
    }
  }

  const getTotalMinted = useTotalMinted({
    gameIdx,
  });

  const offset = props.side == 'light' ? ElementToken.Light : ElementToken.Dark;

  const getTokenPool = useTokenPool({
    gameIdx,
    tokenId:
      (getGameVars.data?.gameIdx as number) * TOKEN_INDEX_OFFSET_BASE + offset,
  });

  const totalMinted = getTotalMinted.data
    ? getTotalMinted.data[props.side]
    : undefined;
  const remaining =
    getTokenPool.data && totalMinted !== undefined
      ? 100 - (100 * getTokenPool.data?.toNumber()) / totalMinted
      : undefined;

  const { number: totalMintedSpring } = useSpring({
    from: { number: 0 },
    number: totalMinted !== undefined ? totalMinted / EFFECT_BASE_FACTOR : 0,
    config: config.molasses,
  });

  return (
    <div
      className={`rounded-full w-48 h-48 bottom-6 right-6 bg-conic-to-t shimmer slow background-animate fast transition-all duration-150 flex justify-center p-4 text-white shadow-inner  outline-double outline-3 outline-offset-2 self-center ${
        props.side === 'dark' ? darkColours : lightColours
      }`}
    >
      {getTokenPool.data == undefined && getTotalMinted.data == undefined ? (
        ''
      ) : (
        <span className="self-center text-lg text-center">
          {getGameStatus.data == 'expired' ||
          getGameStatus.data == 'completed' ? (
            <span className="self-center text-lg text-center capitalize">
              <span className="text-4xl font-bold">
                {totalMinted !== undefined ? (
                  <>
                    <LightningBoltIcon className="inline-block h-6 ml-1" />
                    <animated.div className={'inline-block'}>
                      {totalMintedSpring.to((n) => n.toFixed(0))}
                    </animated.div>
                  </>
                ) : null}
              </span>
              <br />
              {props.side} minted for next game
            </span>
          ) : (
            <span className="self-center text-lg text-center">
              <span className="text-4xl font-bold">
                {remaining?.toFixed(2)} %
              </span>
              <br />
              {props.side?.toUpperCase()} Elements remaining
            </span>
          )}
        </span>
      )}
    </div>
  );
};
