import { BoltIcon } from '@heroicons/react/24/outline';
import { useStarknetBlock } from '@starknet-react/core';
import classNames from 'classnames';
import type { GameContext } from '@/util/minigameApi';

type Prop = {
  gameCtx: GameContext;
};

const GameBlockTimer: React.FC<Prop> = (props) => {
  const { gameStartBlock, currentBlock, hoursPerGame, blocksPerMinute } =
    props.gameCtx;

  const block = useStarknetBlock();

  const startToNum = gameStartBlock.toNumber();

  const endBlock = startToNum + blocksPerMinute * 60 * hoursPerGame;

  const currBlock = block.data?.block_number || currentBlock.toNumber();

  const currentHour =
    Math.floor((currBlock - startToNum) / (blocksPerMinute * 60)) + 1; // to match loop index

  // Game "ticks" are displayed in hour intervals to fit on one screen
  const blockTicks: any[] = [];
  for (let i = 1; i <= hoursPerGame; i++) {
    const pastBg = 'bg-purple-900';
    const currentBg = 'to-gray-900 bg-gradient-to-r from-purple-900';
    const futureBg = 'bg-white text-gray-800';

    const isCurrentHour = i == currentHour;

    blockTicks.push(
      <span
        key={i}
        className={classNames(
          'flex-1 inline-block py-1 text-xs text-center hover:text-gray-600 align-baseline  font-semibold ',
          isCurrentHour ? currentBg : i < currentHour ? pastBg : futureBg,
          isCurrentHour ? 'text-gray-100' : 'text-transparent'
        )}
      >
        {isCurrentHour ? <BoltIcon className="inline-block w-2" /> : null}
        {/* 
        Show boost at hour interval
        using same formula as used in contract.
        Need to clip substring to 4 to handle rounding correctly 
        to match precision in contract 
        */}
        {(((i / hoursPerGame) * 100) / 2).toFixed(3).toString().substring(0, 4)}
      </span>
    );
  }

  return (
    <>
      <div
        id="portal-timer"
        className="fixed bottom-0 z-20 w-full h-auto px-8 font-semibold text-gray-800"
      >
        <div className="flex mt-1">{blockTicks}</div>
        <div className="flex justify-between text-purple-900">
          <div className="">
            <p>Dark Portal opened L2 block {startToNum}</p>
          </div>
          <div>
            <div className="inline-block w-2 h-2 bg-green-700 rounded-full animate-pulse "></div>{' '}
            Current block: {block.data?.block_number}
          </div>
          <div className="text-right">
            <p>Dark Portal closes L2 block {endBlock}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GameBlockTimer;
