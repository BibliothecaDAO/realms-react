import { useStarknetInvoke } from '@starknet-react/core';
import Image from 'next/image';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';

import { battalionIdToString, getUnitImage } from '@/constants/army';
import { useCommandList } from '@/context/CommandListContext';
import {
  ModuleAddr,
  useCombatContract,
} from '@/hooks/settling/stark-contracts';
import type {
  CallAndMetadata,
  RealmsTransactionRenderConfig,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';
import { useGameConstants } from './useGameConstants';

export const Entrypoints = {
  buildArmy: 'build_army_from_battalions',
  initiateCombat: 'initiate_combat',
  attackGoblins: 'attack_goblin_town',
};

export const createCall: Record<string, (args: any) => CallAndMetadata> = {
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
    title: `Summon Army ${metadata.armyId} on Realm ${metadata.realmId}`,
    description: (
      <span>
        {/* Building Army {metadata.armyId} on Realm {metadata.realmId} */}
        {metadata.ids.map((a, index) => {
          return (
            <div className="flex my-1" key={index}>
              <Image
                height={80}
                width={80}
                className="object-fill border rounded"
                src={getUnitImage(a) || ''}
                alt=""
              />
              <div className="self-center ml-4">
                <h3>{battalionIdToString(a)}</h3>
                <h5>{metadata.qty[index]} battalions</h5>
              </div>
            </div>
          );
        })}
      </span>
    ),
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
  const txQueue = useCommandList();
  const { contract } = useCombatContract();
  const { play: raidSound } = useUiSounds(soundSelector.raid);
  const { play: buildArmySound } = useUiSounds(soundSelector.raid);

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
    build: (realmId, armyId, ids, qty, costs) => {
      buildArmySound();
      txQueue.add(
        createCall.buildArmy({
          realmId,
          armyId,
          ids,
          qty,
          costs: {
            amount: 0,
            resources: costs,
          },
        })
      );
    },
    combatLoading,
    combatError: error,
    combatData: combatData,
  };
};

export default useCombat;
