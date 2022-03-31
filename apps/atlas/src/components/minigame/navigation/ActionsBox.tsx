import { LightningBoltIcon } from '@heroicons/react/outline';
import {
  useStarknet,
  useStarknetInvoke,
  useContract,
  useStarknetCall,
} from '@starknet-react/core';
import axios from 'axios';
import type BN from 'bn.js';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import type { Abi } from 'starknet';
import { number } from 'starknet';
import TowerDefenceAbi from '@/abi/minigame/01_TowerDefence.json';
import Elements1155Abi from '@/abi/minigame/ERC1155_Mintable_Ownable.json';
import useGameStats from '@/hooks/desiege/useGameStats';
import { useSiegeBalance } from '@/hooks/desiege/useSiegeBalance';
import useTxCallback from '@/hooks/useTxCallback';
import Button from '@/shared/Button';
import type { GameStatus } from '@/types/index';
import { applyActionAmount } from '@/util/desiegeLogic';
import {
  ELEMENTS_ADDRESS,
  TOKEN_INDEX_OFFSET_BASE,
  getIsApprovedForAll,
  EFFECT_BASE_FACTOR,
} from '@/util/minigameApi';

type Props = {
  gameIdx?: number;
  initialBoostBips?: number;
  gameStatus?: GameStatus;
  setupModalInitialIsOpen?: boolean;
  towerDefenceContractAddress: string;
  towerDefenceStorageContractAddress: string;
  loadingTokenBalance: boolean;
  elementAvailable?: number;
  elementUsed?: number;
  side: string;
  shield: BN | undefined;
  health: BN | undefined;
  tokenBalances: BN[] | undefined;
  currentBoostBips: string;
};
type TokenNameOffsetMap = Record<string, number>;
const divineEclipse: TokenNameOffsetMap = {
  light: 1,
  dark: 2,
};
// The offset is based on the season mapping
const currentTokenOffset = divineEclipse;

// eslint-disable-next-line sonarjs/cognitive-complexity
export const ActionsBox = (props: Props) => {
  const {
    account,
    connectBrowserWallet,
    error: starknetConnectionError,
  } = useStarknet();
  const {
    fetchTokenBalances,
    tokenBalances,
    side,
    loading: loadingTokenBalance,
  } = useSiegeBalance();

  const [mintModalOpen, setMintModalOpen] = useState(
    props.setupModalInitialIsOpen == undefined
      ? false
      : props.setupModalInitialIsOpen
  );
  const noMoreElements =
    props.tokenBalances &&
    props.tokenBalances.length > 0 &&
    props.tokenBalances.every((n) => n.isZero());

  const [appliedAction, setAppliedAction] = useState<{
    shield: number;
    health: number;
    boost: string;
    amount: string;
  }>();

  const [actionAmount, setActionAmount] = useState<string>('1');
  const [action, setAction] = useState<'shield' | 'attack'>();
  const [is1155TokenApproved, setIs1155TokenApproved] = useState<'1' | '0'>();

  const { contract: elementsContract } = useContract({
    abi: Elements1155Abi as Abi,
    address: ELEMENTS_ADDRESS,
  });
  const { contract: towerDefenceContract } = useContract({
    abi: TowerDefenceAbi as Abi,
    address: props.towerDefenceContractAddress,
  });
  const approve1155 = useStarknetInvoke({
    contract: elementsContract,
    method: 'setApprovalForAll',
  });
  const shieldAction = useStarknetInvoke({
    contract: towerDefenceContract,
    method: 'increase_shield',
  });
  const attackAction = useStarknetInvoke({
    contract: towerDefenceContract,
    method: 'attack_tower',
  });

  const txTracker = useTxCallback(
    shieldAction.data || attackAction.data,
    (status) => {
      fetchTokenBalances(props.gameIdx as number);

      // Temp: Post a request to distribute this as a notification
      // TODO: Replace with StarkNet indexer / real-time events in future
      if (
        (status == 'ACCEPTED_ON_L1' || status == 'ACCEPTED_ON_L2') &&
        appliedAction
      ) {
        // Must use applied action values, not live values,
        // as live vallues can change between tx submission and callback execution
        const appliedEffect = applyActionAmount(
          appliedAction.amount,
          appliedAction.boost,
          appliedAction.shield,
          appliedAction.health
        );
        axios
          .post('/api/notify', {
            token_amount: appliedEffect.amountPlusBoost,
            token_offset: side == 'light' ? '1' : '2',
            token_boost: (parseInt(appliedAction.boost) / 100).toFixed(2),
            game_idx: props.gameIdx,
            city_health: appliedEffect.health,
            shield_health: appliedEffect.shield,
          })
          .catch((e) => console.error(e)); // TODO: Handle error
      }
    }
  );

  useEffect(() => {
    setAction(props.side == 'light' ? 'shield' : 'attack');
  }, [props.side]);

  const getIsApproved = useCallback(
    async (account: string, operator: string) => {
      try {
        const isApproved = await getIsApprovedForAll(account, operator);
        setIs1155TokenApproved(isApproved ? '1' : '0');
      } catch (e) {
        // TODO: Handle error
        console.error('Error fetching token approval', e);
      }
    },
    [account]
  );
  const handleAttack = async (gameIndex: number, amount: number) => {
    const tokenId =
      gameIndex * TOKEN_INDEX_OFFSET_BASE + currentTokenOffset[side as string];
    attackAction.invoke({
      args: [
        gameIndex.toString(),
        tokenId.toString(),
        (amount * EFFECT_BASE_FACTOR).toString(),
      ],
    });
    setAppliedAction({
      shield: (props.shield as BN).toNumber() / EFFECT_BASE_FACTOR,
      health: (props.health as BN).toNumber() / EFFECT_BASE_FACTOR,
      boost: props.currentBoostBips,
      amount: actionAmount,
    });
  };

  const approveTracker = useTxCallback(approve1155.data, () => {
    getIsApproved(account as string, props.towerDefenceContractAddress);
  });

  const actionIsLoading =
    shieldAction.loading || attackAction.loading || txTracker.loading;

  useEffect(() => {
    if (is1155TokenApproved == undefined && account !== undefined) {
      getIsApproved(account, props.towerDefenceContractAddress);
    }
  }, [account]);

  const handleShield = async (gameIndex: number, amount: number) => {
    const tokenId =
      gameIndex * TOKEN_INDEX_OFFSET_BASE +
      currentTokenOffset[props.side as string];
    shieldAction.invoke({
      args: [
        gameIndex.toString(),
        tokenId.toString(),
        (amount * EFFECT_BASE_FACTOR).toString(),
      ],
    });
    setAppliedAction({
      shield: (props.shield as BN).toNumber() / EFFECT_BASE_FACTOR,
      health: (props.health as BN).toNumber() / EFFECT_BASE_FACTOR,
      boost: props.currentBoostBips,
      amount: actionAmount,
    });
  };

  const gameStats = useGameStats(
    props.gameIdx == undefined
      ? 0
      : props.gameStatus == 'active'
      ? props.gameIdx
      : props.gameIdx + 1,
    props.towerDefenceStorageContractAddress
  );

  return (
    <div className="bg-white/60 rounded w-auto text-blue-700 p-4 flex flex-col outline-double outline-3 outline-offset-2 border-blue-200">
      <div className="text-center uppercase ">
        <h3>Lord of Light, Your Tokens</h3>
        <h1 className="text-center py-3">
          <div id="token-balance">
            {props.side == 'light' ? (
              <>
                {props.tokenBalances && props.tokenBalances.length > 0
                  ? number
                      .toBN(props.tokenBalances[0])
                      .div(number.toBN(EFFECT_BASE_FACTOR)) // Normalize units
                      .toString()
                  : null}
              </>
            ) : (
              <>
                {props.tokenBalances && props.tokenBalances.length > 1
                  ? number
                      .toBN(props.tokenBalances[1])
                      .div(number.toBN(EFFECT_BASE_FACTOR)) // Normalize units
                      .toString()
                  : null}
              </>
            )}
          </div>
        </h1>
      </div>
      {props.gameStatus == 'active' ? (
        <div className="flex-col flex justify-center space-y-1">
          <div className="flex space-x-2">
            {props.currentBoostBips ? (
              <button className="w-1/2 p-2 font-semibold text-white align-middle transition-colors bg-gradient-to-b from-purple-800 bg-purple-400  h-12  rounded hover:bg-purple-400 w-full">
                Current boost <LightningBoltIcon className="inline-block w-4" />
                {`${parseInt(props.currentBoostBips) / 100}%`}
              </button>
            ) : null}
            <input
              type="number"
              placeholder="1"
              className="w-1/2 text-center h-12  border bg-gradient-to-b bg-white/60  from-white/80 rounded  transform hover:bg-blue-100 uppercase text-blue-400 shadow-xl transition-all duration-300 mb-2 px-8 text-2xl font-semibold"
            />
          </div>
          {account !== undefined && is1155TokenApproved == '1' ? (
            <button
              className=" h-12 text-white  bg-gradient-to-l bg-blue-900/90  from-blue-400 rounded hover:-translate-y-1 transform hover:bg-blue-600 uppercase shadow-xl transition-all duration-300"
              color={'primary'}
              disabled={
                action == undefined ||
                actionAmount.length == 0 ||
                actionIsLoading ||
                noMoreElements ||
                gameStats.loading
              }
              // active={actionIsLoading}
              onClick={() => {
                if (props.gameIdx) {
                  if (action == 'shield') {
                    handleShield(props.gameIdx, parseInt(actionAmount));
                  } else if (action == 'attack') {
                    handleAttack(props.gameIdx, parseInt(actionAmount));
                  }
                }
              }}
            >
              {actionIsLoading
                ? 'Casting Spell'
                : `Cast ${action == 'shield' ? 'Shield' : 'Dark Attack'} Spell`}
            </button>
          ) : null}
          {/* {!noMoreElements ? (
          <Button
            onClick={() => {
              setMintModalOpen(true);
            }}
          >
            Prepare for the next Game
          </Button>
        ) : null} */}
        </div>
      ) : null}
    </div>
  );
};
