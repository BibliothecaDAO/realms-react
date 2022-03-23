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
import useGameStats from '@/hooks/useGameStats';
import { useSiegeBalance } from '@/hooks/useSiegeBalance';
import Button from '@/shared/Button';
import type { GameStatus } from '@/types/index';
import {
  ELEMENTS_ADDRESS,
  TOKEN_INDEX_OFFSET_BASE,
  getIsApprovedForAll,
  EFFECT_BASE_FACTOR,
} from '@/util/minigameApi';
import type { DesiegeTab } from '../ShieldGame';
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
  const noMoreElements =
    tokenBalances &&
    tokenBalances.length > 0 &&
    tokenBalances.every((n) => n.isZero());
  const buttonClasses =
    'w-full h-16  border bg-gradient-to-b bg-white/60  from-white/80 rounded hover:-translate-y-1 transform hover:bg-blue-100 uppercase text-blue-400 shadow-xl transition-all duration-300 px-8';
  return (
    <div className="fixed flex justify-between w-full bottom-12 px-10 z-50  py-2 rounded-t-3xl">
      <ManaBall
        loadingTokenBalance={loadingTokenBalance}
        gameStatus={props.gameStatus}
        side={'light'}
        elementAvailable={gameStats.light}
        elementUsed={gameStats.lightUsed}
      />
      <div className="bg-white/60 rounded w-auto text-blue-700 p-4 flex flex-col outline-double outline-3 outline-offset-2 border-blue-200 justify-between">
        <button
          className={buttonClasses}
          onClick={() => {
            props.toggleTab && props.toggleTab('game-controls');
            router.replace('/desiege?tab=game-controls', undefined, {
              shallow: true,
            });
          }}
        >
          Game
        </button>
        <button
          className={buttonClasses}
          onClick={() => {
            props.toggleTab && props.toggleTab('lore');
            router.replace('/desiege?tab=lore', undefined, {
              shallow: true,
            });
          }}
        >
          Lore
        </button>
        {/* <button
          className={buttonClasses}
          onClick={() => {
            props.toggleTab && props.toggleTab('lore');
            router.replace('/desiege?tab=lore', undefined, {
              shallow: true,
            });
          }}
        >
          Game Guide
        </button> */}
      </div>
      <div className="bg-white/60 rounded w-auto text-blue-700 p-4 flex flex-col outline-double outline-3 outline-offset-2 border-blue-200">
        <div className="text-center uppercase ">
          <h3>Lord of Light, Your Tokens</h3>
          <h1 className="text-center py-3">
            {side == 'light' ? (
              <>
                LIGHT
                {tokenBalances && tokenBalances.length > 0
                  ? number
                      .toBN(tokenBalances[0])
                      .div(number.toBN(EFFECT_BASE_FACTOR)) // Normalize units
                      .toString()
                  : null}
              </>
            ) : (
              '0'
            )}
          </h1>
        </div>

        <div className="flex-col flex justify-center space-y-1">
          <div className="flex space-x-2">
            {currentBoostBips ? (
              <button className="w-1/2 p-2 font-semibold text-white align-middle transition-colors bg-gradient-to-b from-purple-800 bg-purple-400  h-12  rounded hover:bg-purple-400 w-full">
                Current boost <LightningBoltIcon className="inline-block w-4" />
                {`${parseInt(currentBoostBips) / 100}%`}
              </button>
            ) : null}
            <input
              type="number"
              placeholder="1"
              className="w-1/2 text-center h-12  border bg-gradient-to-b bg-white/60  from-white/80 rounded  transform hover:bg-blue-100 uppercase text-blue-400 shadow-xl transition-all duration-300 mb-2 px-8 text-2xl font-semibold"
            />
          </div>

          <button className=" h-12 text-white  bg-gradient-to-l bg-blue-900/90  from-blue-400 rounded hover:-translate-y-1 transform hover:bg-blue-600 uppercase shadow-xl transition-all duration-300">
            Boost Energy Shield
          </button>
        </div>
      </div>
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
