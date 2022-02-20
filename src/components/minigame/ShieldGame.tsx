import React, { useEffect, useState } from "react";
import BN from "bn.js";
import { ElementToken } from "~/constants";
import { GameContext, getGameContextVariables } from "~/util/minigameApi";
import { toBN } from "starknet/dist/utils/number";
import GameBlockTimer from "./GameBlockTimer";
import AddressIndicator from "~/shared/AddressIndicator";
import classNames from "classnames";
import GameControls from "./GameControls";
import { GameStatus } from "~/types";
import TowerDefence from "./TowerDefence";
import MenuBar from "./MenuBar";
import LoreDevKit from "~/shared/LoreDevKit";
import DivineSiege from "~/shared/LoreDevKit/desiege.ldk";
import { useRouter } from "next/router";

export type DesiegeTab = "game-controls" | "lore" | "setup";

type Prop = {
  initialTab?: DesiegeTab;
};

const ShieldGame: React.FC<Prop> = (props) => {
  const router = useRouter();

  const initialTabFromQuery = router.query["tab"] as string;

  const [view, setView] = useState<DesiegeTab | undefined>(
    props.initialTab || (initialTabFromQuery as DesiegeTab)
  );
  // Contract state

  const [gameStatus, setGameStatus] = useState<GameStatus>();

  const [gameIdx, setGameIdx] = useState<number>();
  const [mainHealth, setMainHealth] = useState<BN>();
  const [_startBlockNum, setStartBlockNum] = useState<BN>();
  const [shieldValue, _setShieldValue] = useState<
    Record<ElementToken, string> | undefined
  >();

  const [gameContext, setGameContext] = useState<GameContext>();

  const [boost, setBoost] = useState<number>();

  const fetchState = async () => {
    try {
      const gameCtx = await getGameContextVariables();
      setGameIdx(gameCtx.gameIdx);
      setMainHealth(toBN(gameCtx.mainHealth));
      setStartBlockNum(gameCtx.gameStartBlock);
      setBoost(gameCtx.currentBoost);
      setGameContext(gameCtx);
    } catch (e) {
      // TODO: Display error
      console.error("Error fetching game state: ", e);
    }
  };

  // Fetch state on mount
  useEffect(() => {
    fetchState();
  }, []);

  useEffect(() => {
    if (!!gameContext) {
      const lastBlockOfCurrentGame =
        gameContext.gameStartBlock.toNumber() +
        gameContext.blocksPerMinute * 60 * gameContext.hoursPerGame;

      const gameIsActive =
        gameContext.currentBlock.toNumber() < lastBlockOfCurrentGame;

      let gs: GameStatus;
      if (gameIsActive) {
        if (mainHealth?.lte(toBN(0))) {
          gs = "completed";
        } else {
          gs = "active";
        }
      } else {
        gs = "expired";
      }
      setGameStatus(gs);
    }
  }, [gameContext, mainHealth]);

  return (
    <div className="relative">
      {view == "lore" ? (
        <div className="z-10 flex flex-row gap-20 p-8 bg-gray-800">
          <LoreDevKit ldk={DivineSiege} />
          <GameBlockTimer gameCtx={gameContext} />
        </div>
      ) : null}
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
        <h3 className="flex justify-between text-center text-blue-300 uppercase font-body ">
          <span className="z-10 mx-auto mb-8 text-5xl">
            {/* <ElementLabel> */}
            Desiege game #{gameIdx !== undefined ? gameIdx : "-"}
            {/* </ElementLabel> */}
          </span>
        </h3>

        {view == "game-controls" || view == "setup" ? (
          <div className="flex flex-row w-full">
            <GameControls
              gameStatus={gameStatus as GameStatus}
              gameIdx={gameIdx}
              currentBoostBips={boost}
            />
          </div>
        ) : null}
      </div>
      <TowerDefence
        gameStatus={gameStatus as GameStatus}
        gameIdx={gameIdx}
        currentBoostBips={boost}
      >
        <MenuBar toggleTab={(tab) => setView(tab)} />
      </TowerDefence>
    </div>
  );
};
export default ShieldGame;
