import { useStarknetBlock } from '@starknet-react/core';
import type BN from 'bn.js';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { toBN } from 'starknet/dist/utils/number';

import useGameVariables from '@/hooks/desiege/useGameVariables';
import { LightGradient, DarkGradient } from '@/shared/ElementsLabel';

type Prop = {
  health?: BN;
};

const VictoryDisplay: React.FC<Prop> = (props) => {
  const zeroVitality = props.health !== undefined && props.health.lte(toBN(0));

  const [displayVictory, setDisplayVictory] = useState(false);

  // The amount of blocks to display the victory message.
  const window = 160;

  const gameVars = useGameVariables();
  const block = useStarknetBlock();

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
      {displayVictory ? (
        <span
          className={classNames(
            'inline-block px-2 py-1 text-white rounded-sm bg-gradient-to-r',
            zeroVitality ? DarkGradient : LightGradient
          )}
        >
          {zeroVitality ? 'Dark' : 'Light'} Wins
        </span>
      ) : null}
    </>
  );
};

export default VictoryDisplay;
