import classNames from 'classnames';
import type { GameContext } from '@/util/minigameApi';

type Prop = {
  gameCtx?: GameContext;
};

const GameBlockTimer: React.FC<Prop> = (props) => {
  if (props.gameCtx == undefined) {
    // Present a loading indicator
    return (
      <div className="z-10 w-12 my-2 mb-6 h-96 bg-gradient-to-r from-cyan-600 to-gray-700 animate-pulse"></div>
    );
  }

  const { gameStartBlock, currentBlock, hoursPerGame, blocksPerMinute } =
    props.gameCtx;

  const startToNum = gameStartBlock.toNumber();

  const endBlock = startToNum + blocksPerMinute * 60 * hoursPerGame;
  const currentHour =
    Math.floor(
      (currentBlock.toNumber() - startToNum) / (blocksPerMinute * 60)
    ) + 1; // to match loop index

  // Game "ticks" are displayed in hour intervals to fit on one screen
  const blockTicks = [];
  for (let i = 1; i <= hoursPerGame; i++) {
    const pastBg = 'bg-cyan-200/60';
    const currentBg = 'bg-gradient-to-r from-cyan-600 to-gray-700';
    const futureBg = 'bg-gray-700';

    const isCurrentHour = i == currentHour;

    blockTicks.push(
      <span
        key={i}
        className={classNames(
          'flex-1 inline-block py-1 text-xs text-center hover:text-white align-baseline rounded text-blue-900 backdrop-blur-md w-24',
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
      <div className="relative z-10 flex flex-col w-auto h-full gap-1 my-2">
        <p>Dark Portal opened</p>
        <p>L2 block {startToNum}</p>
        {blockTicks}
        <p>Dark Portal closes at L2 block {endBlock}</p>
      </div>
    </>
  );
};

export default GameBlockTimer;
