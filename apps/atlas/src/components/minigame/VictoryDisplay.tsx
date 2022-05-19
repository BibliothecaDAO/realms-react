import { useStarknetBlock } from '@starknet-react/core';
import type BN from 'bn.js';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { toBN } from 'starknet/dist/utils/number';

import useGameVariables from '@/hooks/desiege/useGameVariables';
import useHealth from '@/hooks/desiege/useHealth';
import { LightGradient, DarkGradient } from '@/shared/ElementsLabel';

type Prop = {
  children?: (darkVictory: boolean) => React.ReactNode[] | React.ReactNode;
  gameIdx?: number;
};

const VictoryDisplay: React.FC<Prop> = (props) => {
  const [displayVictory, setDisplayVictory] = useState(false);

  // The amount of blocks to display the victory message.
  const window = 160;

  const gameVars = useGameVariables();
  const validGameIdx =
    (gameVars.data &&
      props.gameIdx &&
      gameVars.data.gameIdx >= props.gameIdx) ||
    props.gameIdx == undefined;
  const health = useHealth({
    gameIdx: props.gameIdx || gameVars.data?.gameIdx,
  });
  const block = useStarknetBlock();

  const zeroVitality = health.data !== undefined && health.data.lte(toBN(0));

  useEffect(() => {
    if (gameVars.data && block.data) {
      const { gameStartBlock, blocksPerMinute, hoursPerGame } = gameVars.data;
      const endBlock =
        gameStartBlock.toNumber() + blocksPerMinute * 60 * hoursPerGame;

      if (
        (block.data.block_number >= endBlock &&
          block.data.block_number < endBlock + window) ||
        zeroVitality
      ) {
        setDisplayVictory(true);
      } else {
        setDisplayVictory(false);
      }
    }
  }, [gameVars.data, block.data]);
  return (
    <>
      {displayVictory && validGameIdx ? (
        <span
          className={classNames(
            'inline-block px-2 py-1 text-white rounded-sm bg-gradient-to-r',
            zeroVitality ? DarkGradient : LightGradient
          )}
        >
          {props.children ? (
            props.children(zeroVitality)
          ) : (
            <>{zeroVitality ? 'Dark' : 'Light'} Victory</>
          )}
        </span>
      ) : null}
    </>
  );
};

export default VictoryDisplay;
