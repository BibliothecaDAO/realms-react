import { useStarknetInvoke } from '@starknet-react/core';
import type { Call } from 'starknet';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import {
  ModuleAddr,
  useBuildingContract,
} from '@/hooks/settling/stark-contracts';
import { uint256ToRawCalldata } from '@/util/rawCalldata';

type Building = {
  build: (realmId: number, buildingId: number) => void;
};

export const Entrypoints = {
  build: 'build',
};

export const BuildCall: Record<string, (args: any) => Call> = {
  build: (args: { realmId; buildingId }) => ({
    contractAddress: ModuleAddr.Building,
    entrypoint: Entrypoints.build,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(toBN(args.realmId))),
      args.buildingId,
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
    build: (realmId: number, buildingId: number) => {
      buildAction.invoke({
        args: [bnToUint256(toBN(realmId)), buildingId],
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
