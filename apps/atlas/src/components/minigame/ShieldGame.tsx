import { useContract, useStarknetCall } from '@starknet-react/core';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import type { Abi } from 'starknet';
import { toBN } from 'starknet/dist/utils/number';
import TowerDefenceStorageContract from '@/abi/minigame/02_TowerDefenceStorage.json';
import { ElementToken } from '@/constants/index';
import LoadingSkeleton from '@/shared/LoadingSkeleton';
import LoreDevKit from '@/shared/LoreDevKit';
import DivineSiege from '@/shared/LoreDevKit/desiege.ldk';
import type { GameStatus } from '@/types/index';
import type { GameContext } from '@/util/minigameApi';
import {
  getGameContextVariables,
  TOKEN_INDEX_OFFSET_BASE,
} from '@/util/minigameApi';
// import GameBlockTimer from './GameBlockTimer';
import GameBlockTimer from './GameBlockTimer';
import GameControls from './GameControls';
import MenuBar from './MenuBar';
import Modal from './Modal';
import TowerDefence from './TowerDefence';

export type DesiegeTab = 'game-controls' | 'lore' | 'setup';

type Prop = {
  initialTab?: DesiegeTab;
  towerDefenceContractAddr?: string;
  towerDefenceStorageAddr?: string;
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const ShieldGame: React.FC<Prop> = (props) => {
  const router = useRouter();

  const initialTabFromQuery = router.query['tab'] as string;

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
    abi: TowerDefenceStorageContract as Abi,
    address: props.towerDefenceStorageAddr,
  });

  const getMainHealth = useStarknetCall<string[]>({
    contract: tdStorageContract,
    method: gameContext ? 'get_main_health' : undefined,
    args: [gameContext?.gameIdx?.toString() || '1'],
  });

  const getShield = useStarknetCall<string[]>({
    contract: tdStorageContract,
    method: gameContext ? 'get_shield_value' : undefined,
    args: [
      gameContext?.gameIdx.toString() || '0',
      gameContext
        ? (
            gameContext.gameIdx * TOKEN_INDEX_OFFSET_BASE +
            ElementToken.Light
          ).toString()
        : '1',
    ],
  });

  const healthStr = getMainHealth.data ? getMainHealth.data[0] : undefined;

  const shieldStr = getShield.data ? getShield.data[0] : undefined;

  // Memoize so same values don't cause re-renders
  const health = useMemo(() => {
    return healthStr ? toBN(healthStr as string) : undefined;
  }, [healthStr]);

  const shield = useMemo(() => {
    return shieldStr ? toBN(shieldStr as string) : undefined;
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
      console.error('Error fetching game state: ', e);
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

    const gameTimerIsActive =
      gameContext.currentBlock.toNumber() < lastBlockOfCurrentGame;

    let gs: GameStatus;
    if (gameTimerIsActive) {
      if (gameContext.mainHealth.lte(toBN(0))) {
        gs = 'completed';
      } else {
        gs = 'active';
      }
    } else {
      gs = 'expired';
    }
    return gs;
  }, [gameContext]);

  const [loreModalOpen, setLoreModalOpen] = useState(view == 'lore');

  useEffect(() => {
    if (view == 'lore') {
      setLoreModalOpen(true);
    }
  }, [view]);

  // An error occurred server-side and this is not recoverable.
  if (
    props.towerDefenceContractAddr == undefined ||
    props.towerDefenceStorageAddr == undefined ||
    initialLoadError
  ) {
    return (
      <div className="p-8 text-black">
        <h1>You&apos;re Early</h1>
        <p className="text-xl">
          StarkNet is early too. An error occurred during the loading of
          contract state. Please refresh your browser and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {gameContext && gs == 'active' ? (
        <GameBlockTimer gameCtx={gameContext} />
      ) : null}
      <Modal
        isOpen={loreModalOpen}
        toggle={() => {
          setLoreModalOpen(false);
          setView('game-controls');
        }}
      >
        <div className="w-full bg-gray-900 sm:m-8 sm:w-1/2 rounded-xl">
          <LoreDevKit ldk={DivineSiege} initialLayer="Divine Eclipse" />
        </div>
      </Modal>
      <div className="absolute z-10 p-8">
        <h3 className="flex justify-between text-blue-600 uppercase font-body">
          <span className="mb-8 text-5xl z-11">
            Desiege game{' '}
            {gameContext !== undefined ? (
              `${gameContext.gameIdx}`
            ) : (
              <LoadingSkeleton className="inline-block w-8 h-8" />
            )}
          </span>
        </h3>

        {view == 'game-controls' || view == 'setup' ? (
          <div className="w-full">
            <div
              id="game-actions"
              className="w-full p-10 text-black bg-white/30 rounded-2xl"
            >
              {gameContext ? (
                <GameControls
                  towerDefenceContractAddress={props.towerDefenceContractAddr}
                  towerDefenceStorageContractAddress={
                    props.towerDefenceStorageAddr
                  }
                  health={health}
                  shield={shield}
                  gameStatus={gs}
                  gameIdx={gameContext?.gameIdx}
                  initialBoostBips={boost}
                  setupModalInitialIsOpen={view == 'setup'}
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
      ></TowerDefence>
      <MenuBar toggleTab={(tab) => setView(tab)} />
    </div>
  );
};
export default ShieldGame;
