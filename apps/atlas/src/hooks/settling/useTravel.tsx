/* eslint-disable @typescript-eslint/naming-convention */
import { useStarknetCall } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { toBN } from 'starknet/utils/number';
import {
  RealmBuildingId,
  HarvestType,
  buildingIdToString,
} from '@/constants/buildings';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { Realm } from '@/generated/graphql';
import { useGetFoodByRealmIdQuery } from '@/generated/graphql';
import type {
  RealmsCall,
  BuildingDetail,
  RealmFoodDetails,
  AvailableResources,
  RealmsTransactionRenderConfig,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';
import { ModuleAddr } from './stark-contracts';

export const Entrypoints = {
  travel: 'travel',
};

export const createCall: Record<string, (args: any) => RealmsCall> = {
  travel: (args: { travellerId: number; destinationId: number }) => ({
    contractAddress: ModuleAddr.Travel,
    entrypoint: Entrypoints.travel,
    calldata: [
      3,
      ...uint256ToRawCalldata(bnToUint256(args.travellerId)),
      3,
      ...uint256ToRawCalldata(bnToUint256(args.destinationId)),
    ],
    metadata: {
      ...args,
      action: Entrypoints.travel,
    },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.travel]: (tx, _context) => ({
    title: 'Travelling',
    description: ``,
  }),
};

type Travel = {
  travel: (travellerId: number, destinationId: number) => void;
};

// type Props = {
//   token_id?: number;
// };

const useTravel = (): Travel => {
  const txQueue = useTransactionQueue();
  return {
    travel: (travellerId, destinationId) => {
      console.log(travellerId, destinationId);
      txQueue.add(
        createCall.travel({
          travellerId,
          destinationId,
        })
      );
    },
  };
};

export default useTravel;
