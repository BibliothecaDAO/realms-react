import { XCircleIcon } from '@heroicons/react/solid';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import useGameStatus from '@/hooks/desiege/useGameStatus';
import useGameVariables from '@/hooks/desiege/useGameVariables';
import { queryKeys } from '@/hooks/desiege/useTotalMinted';
import LoreDevKit from '@/shared/LoreDevKit';
import DivineSiege from '@/shared/LoreDevKit/desiege.ldk';

import Modal from '../../shared/Modal';
import Bridge from '../bridge/Bridge';
import CheckRewards from './CheckRewards';
import TowerDefence from './CityModel';
import GameBlockTimer from './navigation/GameBlockTimer';
import GameControls from './navigation/GameControls';
import MenuBar from './navigation/MenuBar';

export type DesiegeTab = 'game-controls' | 'lore' | 'setup' | 'check-rewards';

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

  const getGameVariables = useGameVariables();
  const gameStatus = useGameStatus({
    gameIdx: getGameVariables.data?.gameIdx,
  });

  const [modalOpen, setModalOpen] = useState(
    view == 'lore' || view == 'check-rewards'
  );

  const [bridgeModalOpen, setBridgeModalOpen] = useState(view == 'setup');

  useEffect(() => {
    if (view == 'lore' || view == 'check-rewards') {
      setModalOpen(true);
    }
  }, [view]);

  const queryClient = useQueryClient();

  return (
    <div className="relative">
      <Modal
        isOpen={modalOpen}
        toggle={() => {
          setModalOpen(false);
        }}
      >
        <div className="flex-row w-full py-4 text-white bg-gray-900/70 sm:m-8 sm:w-1/2 rounded-xl">
          <h1 className="flex flex-row items-center justify-between px-8">
            <span>{view?.toUpperCase()}</span>
            <button
              onClick={() => setModalOpen(false)}
              className="hover:text-gray-400"
            >
              <XCircleIcon className="h-8" />
            </button>
          </h1>
          <div className="px-8">
            {view == 'lore' ? (
              <LoreDevKit ldk={DivineSiege} initialLayer="Divine Eclipse" />
            ) : null}
            {view == 'check-rewards' && getGameVariables.data !== undefined ? (
              <CheckRewards initialGameIndex={getGameVariables.data.gameIdx} />
            ) : null}
          </div>
        </div>
      </Modal>
      <Modal isOpen={bridgeModalOpen} toggle={() => setBridgeModalOpen(false)}>
        <Bridge
          onComplete={() => {
            setBridgeModalOpen(false);
            // re-fetch total minted to display on the mana balls
            queryClient.invalidateQueries(
              queryKeys.totalMinted(getGameVariables.data?.gameIdx)
            );
          }}
          onClose={() => setBridgeModalOpen(false)}
        />
      </Modal>
      <div className="absolute z-10 p-8">
        <div className="w-full">
          <div
            id="game-actions"
            className="w-full p-8 pt-10 rounded-md shadow-inner bg-gradient-to-b from-white/80"
          >
            <GameControls
              onChooseElements={() => {
                setBridgeModalOpen(true);
              }}
            />
            {getGameVariables.data == undefined ? (
              <p className="text-3xl animate-pulse">
                Loading the Dark Portal...
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <TowerDefence
        gameIdx={getGameVariables.data?.gameIdx}
        gameStatus={gameStatus.data}
      />

      <MenuBar
        setupModalInitialIsOpen={view == 'setup'}
        toggleTab={(tab) => {
          setModalOpen(true);
          setView(tab);
        }}
      />

      {gameStatus.data &&
      gameStatus.data == 'active' &&
      getGameVariables.data ? (
        <GameBlockTimer gameCtx={getGameVariables.data} />
      ) : null}
    </div>
  );
};
export default ShieldGame;
