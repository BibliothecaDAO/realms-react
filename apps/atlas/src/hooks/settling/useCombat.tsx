import { useStarknetInvoke } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { Squad } from '@/constants/index';
import { troopList } from '@/constants/troops';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import {
  ModuleAddr,
  useCombatContract,
} from '@/hooks/settling/stark-contracts';
import type {
  ItemCost,
  RealmsCall,
  RealmsTransactionRenderConfig,
  TroopInterface,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useCosts } from '../costs/useCosts';
import { useUiSounds, soundSelector } from '../useUiSounds';

export const Entrypoints = {
  buildSquad: 'build_squad_from_troops_in_realm',
  initiateCombat: 'initiate_combat',
};

export const createCall: Record<string, (args: any) => RealmsCall> = {
  buildSquad: (args: { realmId; troopIds; squadSlot; costs }) => ({
    contractAddress: ModuleAddr.Combat,
    entrypoint: Entrypoints.buildSquad,
    calldata: [
      args.troopIds.length,
      ...args.troopIds,
      ...uint256ToRawCalldata(bnToUint256(toBN(args.realmId))),
      args.squadSlot,
    ],
    metadata: { ...args, action: Entrypoints.buildSquad },
  }),
  initiateCombat: (args: { attackingRealmId; defendingRealmId }) => ({
    contractAddress: ModuleAddr.Combat,
    entrypoint: Entrypoints.initiateCombat,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(toBN(args.attackingRealmId))),
      ...uint256ToRawCalldata(bnToUint256(toBN(args.defendingRealmId))),
    ],
    metadata: { ...args, action: Entrypoints.initiateCombat },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.buildSquad]: ({ metadata }, { isQueued }) => ({
    title: `Troop Training`,
    description: `Realm #${metadata.realmId} ${
      isQueued ? 'ordered to train' : 'is training'
    } ${metadata.troopIds.length} troops for ${
      Squad[metadata.squadSlot]
    }ing army.`,
  }),
  [Entrypoints.initiateCombat]: ({ metadata }, ctx) => ({
    title: 'Combat',
    description: `Initiate combat with Realm ${metadata.defendingRealmId}`,
  }),
};

const useCombat = () => {
  const txQueue = useTransactionQueue();
  const { contract } = useCombatContract();
  const { costs } = useCosts();
  const { play: raidSound } = useUiSounds(soundSelector.raid);

  const [troops, setTroops] = useState<TroopInterface[]>();

  const pluckClientTroop = (id) => {
    return troopList.find((a) => a.troopId === id);
  };
  useEffect(() => {
    setTroops(
      costs?.troopStats.map((a, i) => {
        return {
          troopId: a.troopId,
          index: i,
          type: a.type,
          tier: a.tier,
          agility: a.agility,
          attack: a.attack,
          armor: a.armor,
          vitality: a.vitality,
          wisdom: a.wisdom,
          troopName: a.troopName,
          troopCost: a.troopCost,
          squadSlot: 1,
          troopColour: pluckClientTroop(a.troopId)?.colour,
          troopImage: pluckClientTroop(a.troopId)?.img,
          buildingId: pluckClientTroop(a.troopId)?.buildingId,
        };
      })
    );
  }, [costs]);

  const {
    data: combatData,
    error,
    loading: combatLoading,
    invoke: combatInvoke,
  } = useStarknetInvoke({
    contract: contract,
    method: Entrypoints.initiateCombat,
  });
  return {
    initiateCombat: (args: { attackingRealmId; defendingRealmId }) => {
      raidSound();
      combatInvoke({
        args: [
          bnToUint256(toBN(args.attackingRealmId)),
          bnToUint256(toBN(args.defendingRealmId)),
        ],
        metadata: {
          action: Entrypoints.initiateCombat,
          ...args,
        },
      });
    },
    build: (
      realmId,
      troopIdsAndCosts: { id: any; cost?: ItemCost }[],
      squadSlot
    ) => {
      const totalCost: ItemCost = troopIdsAndCosts.reduce<ItemCost>(
        (agg, curr) => {
          if (!curr.cost) {
            return agg;
          }
          return {
            amount: agg.amount + curr.cost.amount,
            resources: agg.resources.concat(curr.cost.resources),
          };
        },
        {
          amount: 0,
          resources: [],
        }
      );

      txQueue.add(
        createCall.buildSquad({
          realmId,
          troopIds: troopIdsAndCosts.map((t) => t.id),
          squadSlot,
          costs: totalCost,
        })
      );
    },
    combatLoading,
    combatError: error,
    combatData: combatData,
    troops,
  };
};

export default useCombat;
