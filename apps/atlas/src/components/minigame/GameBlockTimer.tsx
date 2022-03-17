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
  const currentHour =
    Math.floor(
      (currentBlock.toNumber() - startToNum) / (blocksPerMinute * 60)
    ) + 1; // to match loop index

  // Game "ticks" are displayed in hour intervals to fit on one screen
  const blockTicks = [];
  for (let i = 1; i <= hoursPerGame; i++) {
    const pastBg = 'bg-cyan-600';
    const currentBg = 'bg-gradient-to-r from-cyan-600 to-gray-700';
    const futureBg = 'bg-gray-700';

    const isCurrentHour = i == currentHour;

    blockTicks.push(
      <span
        key={i}
        className={classNames(
          'flex-1 inline-block py-1 text-xs text-center hover:text-white align-baseline rounded text-white',
          isCurrentHour ? currentBg : i < currentHour ? pastBg : futureBg,
          isCurrentHour ? 'text-gray-100' : 'text-transparent'
        )}
      >
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
      <div className="relative z-10 gap-1 p-2 bg-black">
        <div className="flex justify-between">
          <div>
            <p>Dark Portal opened L2 block {startToNum}</p>
          </div>
          <div>
            <div className="inline-block w-2 h-2 bg-green-700 rounded-full animate-pulse"></div>{' '}
            {block.data?.block_number}
          </div>
          <div className="text-right">
            <p>Dark Portal closes L2 block {endBlock}</p>
          </div>
        </div>
        <div className="flex gap-1 mt-1">{blockTicks}</div>
      </div>
    </>
  );
};

export default GameBlockTimer;
