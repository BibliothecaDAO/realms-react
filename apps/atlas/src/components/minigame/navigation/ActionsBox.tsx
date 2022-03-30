import { LightningBoltIcon } from '@heroicons/react/outline';
import {
  useStarknet,
  useStarknetInvoke,
  useContract,
} from '@starknet-react/core';
import axios from 'axios';
import type BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import type { Abi } from 'starknet';
import { number } from 'starknet';
import TowerDefenceAbi from '@/abi/minigame/01_TowerDefence.json';
import Elements1155Abi from '@/abi/minigame/ERC1155_Mintable_Ownable.json';
import { ElementToken } from '@/constants/index';
import useBoost from '@/hooks/desiege/useBoost';
import useGameStatus from '@/hooks/desiege/useGameStatus';
import useGameVariables from '@/hooks/desiege/useGameVariables';
import useHealth from '@/hooks/desiege/useHealth';
import useShield from '@/hooks/desiege/useShield';
import {
  queryKeys as userBalanceQueries,
  useTokenBalances,
} from '@/hooks/desiege/useTokenBalances';
import { queryKeys as poolBalanceQueries } from '@/hooks/desiege/useTokenPool';
import { useModuleAddress } from '@/hooks/useModuleAddress';
import useTxCallback from '@/hooks/useTxCallback';
import { ExternalLink } from '@/shared/Icons';
import { applyActionAmount } from '@/util/desiegeLogic';
import {
  ELEMENTS_ADDRESS,
  TOKEN_INDEX_OFFSET_BASE,
  getIsApprovedForAll,
  EFFECT_BASE_FACTOR,
} from '@/util/minigameApi';

type TokenNameOffsetMap = Record<string, number>;
const divineEclipse: TokenNameOffsetMap = {
  light: 1,
  dark: 2,
};
// The offset is based on the season mapping
const currentTokenOffset = divineEclipse;

// eslint-disable-next-line sonarjs/cognitive-complexity
export const ActionsBox = (props) => {
  const { account } = useStarknet();

  const getGameVars = useGameVariables();
  const getGameStatus = useGameStatus({
    gameIdx: getGameVars.data?.gameIdx,
  });
  let gameIdx;
  if (getGameVars.data && getGameStatus.data) {
    if (getGameStatus.data == 'active') {
      gameIdx = getGameVars.data.gameIdx;
    } else {
      gameIdx = getGameVars.data.gameIdx + 1;
    }
  }

  const getTokenBalances = useTokenBalances({
    gameIdx,
  });
  const getShield = useShield({
    gameIdx,
  });
  const getMainHealth = useHealth({
    gameIdx,
  });
  const getBoost = useBoost();

  const towerDefenceAddr = useModuleAddress('1');

  const noMoreElements =
    getTokenBalances.tokenBalances &&
    getTokenBalances.tokenBalances.length > 0 &&
    getTokenBalances.tokenBalances.every((n) => n.isZero());

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
    address: towerDefenceAddr.data,
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

  const queryClient = useQueryClient();

  const txTracker = useTxCallback(
    shieldAction.data || attackAction.data,
    (status) => {
      const tokenOffset =
        getTokenBalances.side == 'light'
          ? ElementToken.Light
          : ElementToken.Dark;
      // Re-fetch the users Element balance and pool balance (elements used)
      queryClient.invalidateQueries(userBalanceQueries.tokenBalance(gameIdx));
      queryClient.invalidateQueries(
        poolBalanceQueries.tokenPoolBalance(
          gameIdx,
          gameIdx * TOKEN_INDEX_OFFSET_BASE + tokenOffset
        )
      );

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
            token_offset: getTokenBalances.side == 'light' ? '1' : '2',
            token_boost: (parseInt(appliedAction.boost) / 100).toFixed(2),
            game_idx: gameIdx,
            city_health: appliedEffect.health,
            shield_health: appliedEffect.shield,
          })
          .catch((e) => console.error(e)); // TODO: Handle error
      }
    }
  );

  useEffect(() => {
    setAction(getTokenBalances.side == 'light' ? 'shield' : 'attack');
  }, [getTokenBalances.side]);

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
      gameIndex * TOKEN_INDEX_OFFSET_BASE +
      currentTokenOffset[getTokenBalances.side as string];
    attackAction.invoke({
      args: [
        gameIndex.toString(),
        tokenId.toString(),
        (amount * EFFECT_BASE_FACTOR).toString(),
      ],
    });
    setAppliedAction({
      shield: (getShield.data as BN).toNumber() / EFFECT_BASE_FACTOR,
      health: (getMainHealth.data as BN).toNumber() / EFFECT_BASE_FACTOR,
      boost: getBoost.data?.toString() as string,
      amount: actionAmount,
    });
  };

  const actionIsLoading =
    shieldAction.loading || attackAction.loading || txTracker.loading;

  useEffect(() => {
    if (is1155TokenApproved == undefined && account !== undefined) {
      getIsApproved(account, towerDefenceAddr.data as string);
    }
  }, [account]);

  const handleShield = async (gameIndex: number, amount: number) => {
    const tokenId =
      gameIndex * TOKEN_INDEX_OFFSET_BASE +
      currentTokenOffset[getTokenBalances.side as string];
    shieldAction.invoke({
      args: [
        gameIndex.toString(),
        tokenId.toString(),
        (amount * EFFECT_BASE_FACTOR).toString(),
      ],
    });
    setAppliedAction({
      shield: (getShield.data as BN).toNumber() / EFFECT_BASE_FACTOR,
      health: (getMainHealth.data as BN).toNumber() / EFFECT_BASE_FACTOR,
      boost: getBoost.data?.toString() as string,
      amount: actionAmount,
    });
  };

  return (
    <div className="flex flex-col w-auto p-4 mb-6 text-blue-700 border-blue-200 rounded bg-white/60 outline-double outline-3 outline-offset-2">
      <div className="text-center uppercase">
        <h3>
          {getTokenBalances.side ? getTokenBalances.side.toUpperCase() : 'My'}{' '}
          Lord, Your Tokens
        </h3>
        <h1 className="py-3 text-center">
          <div id="token-balance">
            {getTokenBalances.side == 'light' ? (
              <>
                {getTokenBalances.tokenBalances &&
                getTokenBalances.tokenBalances.length > 0
                  ? number
                      .toBN(getTokenBalances.tokenBalances[0])
                      .div(number.toBN(EFFECT_BASE_FACTOR)) // Normalize units
                      .toString()
                  : null}
              </>
            ) : (
              <>
                {getTokenBalances.tokenBalances &&
                getTokenBalances.tokenBalances.length > 1
                  ? number
                      .toBN(getTokenBalances.tokenBalances[1])
                      .div(number.toBN(EFFECT_BASE_FACTOR)) // Normalize units
                      .toString()
                  : null}
              </>
            )}
          </div>
        </h1>
      </div>
      {getGameStatus.data == 'active' ? (
        <div className="flex flex-col justify-center space-y-1">
          <div className="flex space-x-2">
            {getBoost.data !== undefined ? (
              <button className="w-1/2 h-12 p-2 font-semibold text-white align-middle transition-colors bg-purple-400 rounded bg-gradient-to-b from-purple-800 hover:bg-purple-400">
                Current boost <LightningBoltIcon className="inline-block w-4" />
                {`${getBoost.data / 100}%`}
              </button>
            ) : null}
            <input
              type="number"
              placeholder="Spell Strength"
              value={actionAmount}
              onChange={(e) => {
                const parsedInt = parseInt(e.target.value);
                if (!isNaN(parsedInt)) {
                  setActionAmount(parsedInt.toString());
                }
              }}
              className="w-1/2 h-12 px-8 mb-2 text-2xl font-semibold text-center text-blue-400 uppercase transition-all duration-300 transform border rounded shadow-xl bg-gradient-to-b bg-white/60 from-white/80 hover:bg-blue-100"
            />
          </div>
          {account !== undefined && is1155TokenApproved == '1' ? (
            <button
              className="h-12 text-white uppercase transition-all duration-300 transform rounded shadow-xl bg-gradient-to-l bg-blue-900/90 from-blue-400 hover:-translate-y-1 hover:bg-blue-600"
              color={'primary'}
              disabled={
                action == undefined ||
                actionAmount.length == 0 ||
                actionIsLoading ||
                noMoreElements
              }
              onClick={() => {
                if (gameIdx !== undefined) {
                  if (action == 'shield') {
                    handleShield(gameIdx, parseInt(actionAmount));
                  } else if (action == 'attack') {
                    handleAttack(gameIdx, parseInt(actionAmount));
                  }
                }
              }}
            >
              {actionIsLoading
                ? 'Casting Spell'
                : `Cast ${action == 'shield' ? 'Shield' : 'Dark Attack'} Spell`}
            </button>
          ) : null}
          {(shieldAction.data || attackAction.data) && actionIsLoading ? (
            <p className="mt-2">
              <a
                // TODO: Choose host dynamically here based on network
                href={`https://goerli.voyager.online/tx/${
                  shieldAction.data || attackAction.data
                }/`}
                className="underline"
                target={'_blank'}
                rel="noopener noreferrer"
              >
                Check Transaction Status
              </a>
              <ExternalLink className="inline-block h-4 ml-1" />
            </p>
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
