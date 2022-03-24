import { LightningBoltIcon } from '@heroicons/react/outline';
import {
  useStarknet,
  useStarknetInvoke,
  useContract,
  useStarknetCall,
} from '@starknet-react/core';
import type BN from 'bn.js';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import type { Abi } from 'starknet';
import { number } from 'starknet';
import TowerDefenceAbi from '@/abi/minigame/01_TowerDefence.json';
import useGameStats from '@/hooks/desiege/useGameStats';
import { useSiegeBalance } from '@/hooks/desiege/useSiegeBalance';
import type { GameStatus } from '@/types/index';
import {
  ELEMENTS_ADDRESS,
  TOKEN_INDEX_OFFSET_BASE,
  getIsApprovedForAll,
  EFFECT_BASE_FACTOR,
} from '@/util/minigameApi';
import type { DesiegeTab } from '../ShieldGame';
import { ActionsBox } from './ActionsBox';
import { ManaBall } from './ManaBall';
type Prop = {
  gameIdx?: number;
  initialBoostBips?: number;
  health?: BN;
  shield?: BN;
  gameStatus?: GameStatus;
  setupModalInitialIsOpen?: boolean;
  towerDefenceContractAddress: string;
  towerDefenceStorageContractAddress: string;
  toggleTab?: (tab: DesiegeTab) => void;
};
function MenuBar(props: Prop) {
  const {
    account,
    connectBrowserWallet,
    error: starknetConnectionError,
  } = useStarknet();

  const router = useRouter();
  const gameStats = useGameStats(
    props.gameIdx == undefined
      ? 0
      : props.gameStatus == 'active'
      ? props.gameIdx
      : props.gameIdx + 1,
    props.towerDefenceStorageContractAddress
  );
  const { contract: towerDefenceContract } = useContract({
    abi: TowerDefenceAbi as Abi,
    address: props.towerDefenceContractAddress,
  });
  const boostEffect = useStarknetCall({
    contract: towerDefenceContract,
    method: 'get_current_boost',
  });

  const currentBoostBips = boostEffect.data
    ? boostEffect.data[0].toString()
    : props.initialBoostBips?.toString();

  const {
    fetchTokenBalances,
    tokenBalances,
    side,
    loading: loadingTokenBalance,
  } = useSiegeBalance();

  useEffect(() => {
    if (
      account &&
      props.gameIdx !== undefined &&
      props.gameStatus !== undefined
    ) {
      if (props.gameStatus == 'active') {
        // Fetch balances for current game
        fetchTokenBalances(props.gameIdx);
      } else {
        // Fetch & show balances for the upcoming game
        fetchTokenBalances(props.gameIdx + 1);
      }
    }
  }, [account, props.gameIdx, props.gameStatus]);

  const buttonClasses =
    'w-full h-16  border bg-gradient-to-b bg-white/60  from-white/80 rounded hover:-translate-y-1 transform hover:bg-blue-100 uppercase text-blue-400 shadow-xl transition-all duration-300 px-8';
  return (
    <div className="fixed z-50 flex items-center justify-between w-full px-10 py-2 bottom-12 rounded-t-3xl">
      <ManaBall
        loadingTokenBalance={loadingTokenBalance}
        gameStatus={props.gameStatus}
        side={'light'}
        elementAvailable={gameStats.light}
        elementUsed={gameStats.lightUsed}
      />
      <div className="flex flex-row justify-between w-auto gap-4 p-4 text-blue-700 border-blue-200 rounded bg-white/60 outline-double outline-3 outline-offset-2">
        <button
          className={buttonClasses}
          onClick={() => {
            // TODO: Take an intelligent action when pressing this important button
          }}
        >
          Game
        </button>
        <button
          className={buttonClasses}
          onClick={() => {
            props.toggleTab && props.toggleTab('lore');
          }}
        >
          Lore
        </button>
        <button
          className={buttonClasses}
          onClick={() => {
            props.toggleTab && props.toggleTab('check-rewards');
          }}
        >
          Rewards
        </button>
      </div>
      <ActionsBox
        currentBoostBips={currentBoostBips}
        setupModalInitialIsOpen={props.setupModalInitialIsOpen}
        tokenBalances={tokenBalances}
        gameIdx={props.gameIdx}
        initialBoostBips={props.initialBoostBips}
        loadingTokenBalance={loadingTokenBalance}
        gameStatus={props.gameStatus}
        side={'light'}
        health={props.health}
        shield={props.shield}
        elementAvailable={gameStats.dark}
        elementUsed={gameStats.darkUsed}
        towerDefenceContractAddress={props.towerDefenceContractAddress}
        towerDefenceStorageContractAddress={
          props.towerDefenceStorageContractAddress
        }
      />
      <ManaBall
        loadingTokenBalance={loadingTokenBalance}
        gameStatus={props.gameStatus}
        side={'dark'}
        elementAvailable={gameStats.dark}
        elementUsed={gameStats.darkUsed}
      />
    </div>
  );
}

export default MenuBar;
