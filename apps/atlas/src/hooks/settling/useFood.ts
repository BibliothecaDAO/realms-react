import { bnToUint256 } from 'starknet/dist/utils/uint256';
import type { RealmsCall } from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { ModuleAddr } from './stark-contracts';

export const entrypoints = {
  create: 'create',
  harvest: 'harvest',
};

export const createCall: Record<string, (args: any) => RealmsCall> = {
  create: (args: {
    tokenId: number;
    quantity: number;
    foodBuildingId: number;
  }) => ({
    contractAddress: ModuleAddr.Food,
    entrypoint: entrypoints.create,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(args.tokenId)),
      args.quantity,
      args.foodBuildingId,
    ],
    metadata: {
      ...args,
      action: entrypoints.create,
    },
  }),
  harvest: (args: {
    tokenId: number;
    harvestType: number;
    foodBuildingId: number;
  }) => ({
    contractAddress: ModuleAddr.Food,
    entrypoint: entrypoints.harvest,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(args.tokenId)),
      args.harvestType,
      args.foodBuildingId,
    ],
    metadata: {
      ...args,
      action: entrypoints.harvest,
    },
  }),
};
