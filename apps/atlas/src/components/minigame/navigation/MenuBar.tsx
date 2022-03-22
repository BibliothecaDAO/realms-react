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
import TowerDefenceAbi from '@/abi/minigame/01_TowerDefence.json';
import useGameStats from '@/hooks/useGameStats';
import { useSiegeBalance } from '@/hooks/useSiegeBalance';
import Button from '@/shared/Button';
import type { GameStatus } from '@/types/index';
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

  return (
    <div className="fixed flex justify-between w-full bottom-24 px-10 z-50  py-2 rounded-t-3xl">
      <ManaBall
        loadingTokenBalance={loadingTokenBalance}
        gameStatus={props.gameStatus}
        side={'light'}
        elementAvailable={gameStats.light}
        elementUsed={gameStats.lightUsed}
      />

      <div className="self-center h-full">
        <div className="flex px-4 mx-auto align-middle w-96 rounded uppercase p-2 text-2xl h-full space-x-2">
          <button
            className="w-48 h-24  border bg-white text-blue-400 rounded shadow-inner"
            onClick={() => {
              props.toggleTab && props.toggleTab('game-controls');
              router.replace('/desiege?tab=game-controls', undefined, {
                shallow: true,
              });
            }}
          >
            Action
          </button>
          <button
            className="w-48 h-24  border bg-white text-blue-400 rounded shadow-inner"
            onClick={() => {
              props.toggleTab && props.toggleTab('lore');
              router.replace('/desiege?tab=lore', undefined, {
                shallow: true,
              });
            }}
          >
            Lore
          </button>

          {/* {currentBoostBips ? (
            <button className="p-2 font-semibold text-white align-middle transition-colors bg-purple-800 w-48 h-24  rounded-md hover:bg-purple-900 h-full">
              <LightningBoltIcon className="inline-block w-4" />{' '}
              {`${parseInt(currentBoostBips) / 100}%`}
            </button>
          ) : null} */}
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
