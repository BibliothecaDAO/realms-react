import { useChannel } from '@ably-labs/react-hooks';
import { BoltIcon } from '@heroicons/react/24/outline';
import {
  useStarknet,
  useStarknetInvoke,
  useContract,
} from '@starknet-react/core';
import axios from 'axios';
import type BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useSpring, animated, config } from 'react-spring';
import type { Abi } from 'starknet';
import TowerDefenceAbi from '@/abi/minigame/01_TowerDefence.json';
import { ElementToken } from '@/constants/index';
import use1155Approval from '@/hooks/desiege/use1155Approval';
import {
  BattleAction,
  battleChannelName,
  useBattleContext,
} from '@/hooks/desiege/useBattleContext';
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
import { getHostname } from '@/util/blockExplorer';
import { applyActionAmount } from '@/util/desiegeLogic';
import {
  TOKEN_INDEX_OFFSET_BASE,
  EFFECT_BASE_FACTOR,
  starknetNetwork,
} from '@/util/minigameApi';

type TokenNameOffsetMap = Record<string, number>;
const divineEclipse: TokenNameOffsetMap = {
  light: 1,
  dark: 2,
};
// eslint-disable-next-line sonarjs/cognitive-complexity
const ActionsBox = (props) => {
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
  const tokenOffset = divineEclipse[getTokenBalances.side as string];
  const tokenBalance: BN | undefined =
    getTokenBalances.side &&
    getTokenBalances.tokenBalances &&
    tokenOffset !== undefined
      ? getTokenBalances.tokenBalances[tokenOffset - 1] // to account for 0-indexing
      : undefined;

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

  const { contract: towerDefenceContract } = useContract({
    abi: TowerDefenceAbi as Abi,
    address: towerDefenceAddr.data,
  });

  const shieldAction = useStarknetInvoke({
    contract: towerDefenceContract,
    method: 'increase_shield',
  });
  const attackAction = useStarknetInvoke({
    contract: towerDefenceContract,
    method: 'attack_tower',
  });

  const contractApproval = use1155Approval();

  const queryClient = useQueryClient();

  const battle = useBattleContext();

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

      battle.setDarkAttacking(false);
      battle.setLightShielding(false);

      // Temp: Post a request to distribute this as a notification
      // TODO: Replace with StarkNet indexer / real-time events in future
      if (
        (status == 'ACCEPTED_ON_L1' ||
          status == 'ACCEPTED_ON_L2' ||
          status == 'PENDING') &&
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

  const { number: elementTokenBalanceSpring } = useSpring({
    from: { number: 0 },
    number:
      tokenBalance !== undefined
        ? tokenBalance.toNumber() / EFFECT_BASE_FACTOR
        : 0,
    config: config.molasses,
  });

  useEffect(() => {
    if (!attackAction.loading && attackAction.error) {
      battle.setDarkAttacking(false);
    }
  }, [attackAction.error, attackAction.loading]);

  useEffect(() => {
    if (!shieldAction.loading && shieldAction.error) {
      battle.setLightShielding(false);
    }
  }, [shieldAction.error, shieldAction.loading]);

  const [channel] = useChannel(battleChannelName, (message) => {
    // Empty. Messages from battle channel are handled in useBattleContext
  });

  const handleAttack = async (gameIndex: number, amount: number) => {
    const tokenId = gameIndex * TOKEN_INDEX_OFFSET_BASE + tokenOffset;
    attackAction.invoke({
      args: [
        gameIndex.toString(),
        tokenId.toString(),
        (amount * EFFECT_BASE_FACTOR).toString(),
      ],
    });
    // Trigger the dark shadow on all connected clients
    channel.publish({
      data: BattleAction.DarkAttack,
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

  const handleShield = async (gameIndex: number, amount: number) => {
    const tokenId = gameIndex * TOKEN_INDEX_OFFSET_BASE + tokenOffset;
    shieldAction.invoke({
      args: [
        gameIndex.toString(),
        tokenId.toString(),
        (amount * EFFECT_BASE_FACTOR).toString(),
      ],
    });
    channel.publish({
      data: BattleAction.LightShield,
    });
    setAppliedAction({
      shield: (getShield.data as BN).toNumber() / EFFECT_BASE_FACTOR,
      health: (getMainHealth.data as BN).toNumber() / EFFECT_BASE_FACTOR,
      boost: getBoost.data?.toString() as string,
      amount: actionAmount,
    });
  };

  return (
    <div className="flex flex-col p-2 mb-6 text-gray-900 border-blue-200 rounded w-80 bg-white/60 outline-double outline-3 outline-offset-2">
      <div className="mb-2 uppercase">
        <h3 className="text-center text-gray-800">
          {getTokenBalances.side ? getTokenBalances.side.toUpperCase() : 'My'}{' '}
          Tokens:{' '}
          <div className="inline-block ml-2 text-3xl" id="token-balance">
            <animated.div>
              {elementTokenBalanceSpring.to((n) => n.toFixed(0))}
            </animated.div>
          </div>
        </h3>
      </div>
      {getGameStatus.data == 'active' ? (
        <div className="flex flex-col justify-center space-y-1">
          <div className="flex items-center mb-2 space-x-2">
            {getBoost.data !== undefined ? (
              <div
                id="action-boost"
                className="w-1/2 p-1 text-sm font-semibold text-center transition-colors to-gray-900 bg-gradient-to-r from-purple-900"
              >
                Boost <BoltIcon className="inline-block w-4" />
                {`${getBoost.data / 100}%`}
              </div>
            ) : null}
            <input
              id="action-amount"
              type="number"
              placeholder="Spell Strength"
              value={actionAmount}
              onChange={(e) => {
                setActionAmount(e.target.value);
              }}
              className="w-1/2 h-12 px-8 text-2xl font-semibold text-center text-blue-400 uppercase transition-all duration-300 transform border rounded shadow-xl bg-gradient-to-b bg-white/60 from-white/80 hover:bg-blue-100"
            />
          </div>
          {contractApproval.approvalStatus == 'approved' ? (
            <button
              className="h-12 uppercase transition-all duration-300 transform rounded shadow-xl bg-gradient-to-l bg-blue-900/90 from-blue-400 hover:-translate-y-1 hover:bg-blue-600 disabled:opacity-60 disabled:hover:translate-y-0"
              color={'primary'}
              disabled={
                account == undefined ||
                action == undefined ||
                actionAmount.length == 0 ||
                actionIsLoading ||
                noMoreElements
              }
              onClick={() => {
                const parsedInt = parseInt(actionAmount);
                if (gameIdx !== undefined && !isNaN(parsedInt)) {
                  if (action == 'shield') {
                    handleShield(gameIdx, parsedInt);
                  } else if (action == 'attack') {
                    handleAttack(gameIdx, parsedInt);
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
                href={`https://${getHostname(starknetNetwork)}/tx/${
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

export default ActionsBox;
