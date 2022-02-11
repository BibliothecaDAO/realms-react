import React, { useEffect, useState } from "react";
import BN from "bn.js";
import { ElementToken } from "~/constants";
import { GameContext, getGameContextVariables } from "~/util/minigameApi";
import Castle from "./Castle";
import { toBN } from "starknet/dist/utils/number";
import GameBlockTimer from "./GameBlockTimer";
import AddressIndicator from "~/shared/AddressIndicator";
import classNames from "classnames";
import GameControls from "./GameControls";
import { GameStatus } from "~/types";
import TowerDefence from "../TowerDefence";
import ElementLabel from "~/shared/ElementsLabel";
type Prop = {};

const ShieldGame: React.FC<Prop> = (props) => {
  // Contract state
  const [gameIdx, setGameIdx] = useState<number>();
  const [mainHealth, setMainHealth] = useState<BN>();
  const [_startBlockNum, setStartBlockNum] = useState<BN>();
  const [shieldValue, _setShieldValue] = useState<
    Record<ElementToken, string> | undefined
  >();

  const [gameCtx, setGameCtx] = useState<GameContext>();

  const [boost, setBoost] = useState<number>();

  const fetchState = async () => {
    const gameCtx = await getGameContextVariables();

    setGameIdx(gameCtx.gameIdx);
    setMainHealth(toBN(gameCtx.mainHealth));
    setStartBlockNum(gameCtx.gameStartBlock);
    setBoost(gameCtx.currentBoost);
    setGameCtx(gameCtx);
  };

  // Fetch state on mount
  useEffect(() => {
    fetchState();
  }, []);

  const lastBlockOfCurrentGame = gameCtx
    ? gameCtx.gameStartBlock.toNumber() +
    gameCtx.blocksPerMinute * 60 * gameCtx.hoursPerGame
    : undefined;

  const gameIsActive =
    gameCtx &&
    lastBlockOfCurrentGame !== undefined &&
    gameCtx.currentBlock.toNumber() < lastBlockOfCurrentGame;

  let gameStatus: GameStatus;
  if (gameIsActive) {
    if (mainHealth?.lte(toBN(0))) {
      gameStatus = "completed";
    } else {
      gameStatus = "active";
    }
  } else {
    gameStatus = "expired";
  }

  return (
    <div className="relative">
      <div className="absolute w-full p-8">
        {/* {gameCtx ? (
          <span
            className={classNames(
              "text-sm text-gray-500 p-1 rounded-sm ml-4 font-semibold",
              gameIsActive ? "text-green-200" : "text-red-800"
            )}
          >
            {gameStatus.toUpperCase()}
          </span>
        ) : null} */}
        <h3 className="flex justify-between text-center uppercase font-body text-blue-300 font-semibold">
          <span className="z-10 mb-8 text-5xl mx-auto">
            {/* <ElementLabel> */}
            Desiege game # {gameIdx !== undefined ? gameIdx : "-"}
            {/* </ElementLabel> */}
          </span>
        </h3>
        <AddressIndicator />
        <div className="mb-8 z-10">
          <GameBlockTimer gameCtx={gameCtx} />
        </div>

        <div className="flex flex-row w-full">
          {/* <GameControls
            gameStatus={gameStatus}
            gameIdx={gameIdx}
            currentBoostBips={boost}
          /> */}

        </div>
      </div>

      <TowerDefence
        gameStatus={gameStatus}
        gameIdx={gameIdx}
        currentBoostBips={boost}
      />
    </div>
  );
};
export default ShieldGame;
