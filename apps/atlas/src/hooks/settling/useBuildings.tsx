import { useStarknetCall, useStarknetInvoke } from '@starknet-react/core';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import {
  ModuleAddr,
  useBuildingContract,
} from '@/hooks/settling/stark-contracts';
import type { RealmsCall } from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';

type Building = {
  build: (realmId: number, buildingId: number, qty: number) => void;
  // getEffectiveBuildings: (realmId: number) => void;
};

export const Entrypoints = {
  build: 'build',
};

export const createBuildingCall: Record<string, (args: any) => RealmsCall> = {
  build: (args: { realmId; buildingId; qty }) => ({
    contractAddress: ModuleAddr.Building,
    entrypoint: Entrypoints.build,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(toBN(args.realmId))),
      args.buildingId,
      args.qty,
    ],
    metadata: { ...args, action: Entrypoints.build },
  }),
};

const useBuildings = (): Building => {
  const { contract: buildingContract } = useBuildingContract();

  const buildAction = useStarknetInvoke({
    contract: buildingContract,
    method: 'build',
  });

  return {
    build: (realmId: number, buildingId: number, qty: number) => {
      buildAction.invoke({
        args: [bnToUint256(toBN(realmId)), buildingId, qty],
        metadata: {
          action: 'realm_building',
          realmId,
          buildingId,
        },
      });
    },
  };
};

export default useBuildings;
