import { useStarknetInvoke } from '@starknet-react/core';

import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import {
  ModuleAddr,
  useCombatContract,
} from '@/hooks/settling/stark-contracts';
import type { RealmsCall } from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';

export const Entrypoints = {
  buildSquad: 'build_squad_from_troops_in_realm',
  initiateCombat: 'initiate_combat',
};

export const createCall: Record<string, (args: any) => RealmsCall> = {
  buildSquad: (args: { realmId; troopIds; squadSlot }) => ({
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
};

const useCombat = () => {
  const { contract: combatContract } = useCombatContract();

  const {
    data: combatData,
    error,
    loading: combatLoading,
    invoke: combatInvoke,
  } = useStarknetInvoke({
    contract: combatContract,
    method: 'initiate_combat',
  });

  return {
    initiateCombat: (args: { attackingRealmId; defendingRealmId }) => {
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
    combatLoading,
    combatError: error,
    combatData: combatData,
  };
};

export default useCombat;
