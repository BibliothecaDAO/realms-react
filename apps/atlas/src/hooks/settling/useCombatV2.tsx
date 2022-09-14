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
  buildArmy: 'build_army_from_battalions',
  initiateCombat: 'initiate_combat',
  attackGoblins: 'attack_goblin_town',
};

export const createCall: Record<string, (args: any) => RealmsCall> = {
  buildArmy: (args: { realmId; armyId; ids; qty; costs }) => ({
    contractAddress: ModuleAddr.Combat,
    entrypoint: Entrypoints.buildArmy,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(toBN(args.realmId))),
      args.armyId,
      args.ids.length,
      ...args.ids,
      args.qty.length,
      ...args.qty,
    ],
    metadata: { ...args, action: Entrypoints.buildArmy },
  }),
  // initiateCombat: (args: { attackingRealmId; defendingRealmId }) => ({
  //   contractAddress: ModuleAddr.Combat,
  //   entrypoint: Entrypoints.initiateCombat,
  //   calldata: [
  //     ...uint256ToRawCalldata(bnToUint256(toBN(args.attackingRealmId))),
  //     ...uint256ToRawCalldata(bnToUint256(toBN(args.defendingRealmId))),
  //   ],
  //   metadata: { ...args, action: Entrypoints.initiateCombat },
  // }),
  attackGoblins: (args: { attackingRealmId }) => ({
    contractAddress: ModuleAddr.Combat,
    entrypoint: Entrypoints.attackGoblins,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(toBN(args.attackingRealmId))),
    ],
    metadata: { ...args, action: Entrypoints.attackGoblins },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.buildArmy]: ({ metadata }, { isQueued }) => ({
    title: `Troop Training`,
    description: `ssd`,
  }),
  [Entrypoints.initiateCombat]: ({ metadata }, ctx) => ({
    title: 'Combat',
    description: `Initiate combat with Realm ${metadata.defendingRealmId}`,
  }),
  [Entrypoints.attackGoblins]: ({ metadata }, ctx) => ({
    title: 'Attack Goblins',
    description: `${metadata.attackingRealmId} has setout to crush the Goblins`,
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
    attackGoblins: (attackingRealmId) => {
      raidSound();
      txQueue.add(
        createCall.attackGoblins({
          attackingRealmId,
        })
      );
    },
    initiateCombat: (args: {
      attackingArmyId;
      attackingRealmId;
      defendingRealmId;
    }) => {
      raidSound();

      // TODO: Check client side that Army is actually at the Realm
      combatInvoke({
        args: [
          args.attackingArmyId,
          bnToUint256(toBN(args.attackingRealmId)),
          0, // only attack base realm
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
      armyId,
      ids,
      qty
      // battalionIdsQtyCosts: { ids: any; qty: any; cost?: ItemCost }[]
    ) => {
      // const totalCost: ItemCost = battalionIdsQtyCosts.reduce<ItemCost>(
      //   (agg, curr) => {
      //     if (!curr.cost) {
      //       return agg;
      //     }
      //     return {
      //       amount: agg.amount + curr.cost.amount,
      //       resources: agg.resources.concat(curr.cost.resources),
      //     };
      //   },
      //   {
      //     amount: 0,
      //     resources: [],
      //   }
      // );

      txQueue.add(
        createCall.buildArmy({
          realmId,
          armyId,
          ids,
          qty,
          // costs: totalCost,
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
