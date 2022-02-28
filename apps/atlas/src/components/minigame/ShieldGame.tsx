import React, { useEffect, useMemo, useState } from "react";
import BN from "bn.js";
import { ElementToken } from "~/constants";
import { GameContext, getGameContextVariables } from "@/util/minigameApi";
import { toBN } from "starknet/dist/utils/number";
import GameBlockTimer from "./GameBlockTimer";
import AddressIndicator from "@/shared/AddressIndicator";
import classNames from "classnames";
import GameControls from "./GameControls";
import { GameStatus } from "~/types";
import TowerDefence from "./TowerDefence";
import MenuBar from "./MenuBar";
import LoreDevKit from "@/shared/LoreDevKit";
import DivineSiege from "@/shared/LoreDevKit/desiege.ldk";
import { useRouter } from "next/router";
import LoadingSkeleton from "~/shared/LoadingSkeleton";
import TowerDefenceStorageContract from "~/abi/minigame/02_TowerDefenceStorage.json";
import { useContract, useStarknetCall } from "@starknet-react/core";
import { Abi } from "starknet";
import { TOKEN_INDEX_OFFSET_BASE } from "~/util/minigameApi";

export type DesiegeTab = "game-controls" | "lore" | "setup";

type Prop = {
  initialTab?: DesiegeTab;
  towerDefenceContractAddr?: string;
  towerDefenceStorageAddr?: string;
};

const ShieldGame: React.FC<Prop> = (props) => {
  const router = useRouter();

  const initialTabFromQuery = router.query["tab"] as string;

  const [view, setView] = useState<DesiegeTab | undefined>(
    props.initialTab || (initialTabFromQuery as DesiegeTab)
  );
  // Contract state

  const [initialLoadError, setInitialLoadError] = useState<string>();
  const [gameContext, setGameContext] = useState<GameContext>();

  const [boost, setBoost] = useState<number>();

  useEffect(() => {
    if (gameContext) {
      setBoost(gameContext.currentBoost);
    }
  }, [gameContext]);

  const { contract: tdStorageContract } = useContract({
    // @ts-ignore
    abi: TowerDefenceStorageContract.abi as Abi[],
    address: props.towerDefenceStorageAddr,
  });

  const getMainHealth = useStarknetCall({
    contract: tdStorageContract,
    method: gameContext ? "get_main_health" : undefined,
    args: {
      game_idx: gameContext?.gameIdx?.toString() || "1",
    },
  });

  const getShield = useStarknetCall({
    contract: tdStorageContract,
    method: gameContext ? "get_shield_value" : undefined,
    args: {
      game_idx: gameContext?.gameIdx.toString() || "0",
      token_id: gameContext
        ? (
            gameContext.gameIdx * TOKEN_INDEX_OFFSET_BASE +
            ElementToken.Light
          ).toString()
        : "1",
    },
  });

  const healthStr = getMainHealth.data
    ? getMainHealth.data["health"]
    : undefined;

  const shieldStr = getShield.data ? getShield.data["value"] : undefined;

  // Memoize so same values don't cause re-renders
  const health = useMemo(() => {
    return toBN((healthStr as string) || 0);
  }, [healthStr]);

  const shield = useMemo(() => {
    return toBN((shieldStr as string) || 0);
  }, [shieldStr]);

  const fetchState = async () => {
    try {
      const gameCtx = await getGameContextVariables(
        props.towerDefenceContractAddr as string
      );
      setGameContext(gameCtx);
      setInitialLoadError(undefined);
    } catch (e: any) {
      setInitialLoadError(e.message);
      console.error("Error fetching game state: ", e);
    }
  };

  // Fetch state on mount
  useEffect(() => {
    if (props.towerDefenceContractAddr) {
      fetchState();
    }
  }, []);

  const gs = useMemo(() => {
    if (!gameContext) {
      return undefined;
    }
    const lastBlockOfCurrentGame =
      gameContext.gameStartBlock.toNumber() +
      gameContext.blocksPerMinute * 60 * gameContext.hoursPerGame;

    const gameIsActive =
      gameContext.currentBlock.toNumber() < lastBlockOfCurrentGame;

    let gs: GameStatus;
    if (gameIsActive) {
      if (gameContext.mainHealth.lte(toBN(0))) {
        gs = "completed";
      } else {
        gs = "active";
      }
    } else {
      gs = "expired";
    }
    return gs;
  }, [gameContext]);

  // An error occurred server-side and this is not recoverable.
  if (
    props.towerDefenceContractAddr == undefined ||
    props.towerDefenceStorageAddr == undefined ||
    initialLoadError
  ) {
    return (
      <div className="text-black">
        <h1>You&apos;re Early</h1>
        <p>
          StarkNet is early too. An error occurred during the loading of
          contract state. Please refresh your browser and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {view == "lore" ? (
        <div className="z-10 flex flex-row gap-20 p-8 bg-gray-800">
          <LoreDevKit ldk={DivineSiege} />
          <GameBlockTimer gameCtx={gameContext} />
        </div>
      ) : null}
      <div className="absolute z-10 w-full p-8">
        <h3 className="flex justify-between text-center text-blue-300 uppercase font-body ">
          <span className="mx-auto mb-8 text-5xl z-11">
            Desiege game{" "}
            {gameContext !== undefined ? (
              `${gameContext.gameIdx}`
            ) : (
              <LoadingSkeleton className="inline-block w-8 h-8" />
            )}
          </span>
        </h3>

        {view == "game-controls" || view == "setup" ? (
          <div className="flex flex-row w-full">
            <div
              id="game-actions"
              className="w-1/3 p-10 text-black bg-white/30 rounded-2xl"
            >
              {!!gameContext ? (
                <GameControls
                  towerDefenceContractAddress={props.towerDefenceContractAddr}
                  towerDefenceStorageContractAddress={
                    props.towerDefenceStorageAddr
                  }
                  gameStatus={gs}
                  gameIdx={gameContext?.gameIdx}
                  currentBoostBips={boost}
                  setupModalInitialIsOpen={view == "setup"}
                />
              ) : (
                <p className="text-2xl">Loading...</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
      <TowerDefence
        gameStatus={gs}
        health={health}
        shield={shield}
        gameIdx={gameContext?.gameIdx}
        currentBoostBips={boost}
      >
        <MenuBar toggleTab={(tab) => setView(tab)} />
      </TowerDefence>
    </div>
  );
};
export default ShieldGame;
