/* eslint-disable @typescript-eslint/naming-convention */

import { useState } from 'react';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import { getTravelArcs } from '@/shared/Getters/Realm';
import type { RealmsCall, RealmsTransactionRenderConfig } from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
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

export type Travel = {
  travel: (travellerId: number, destinationId: number) => void;
  setTravelArcs: (location: number, assets: number[]) => void;
  travelArcs: TravelArc[] | undefined;
};

type TravelArc = {
  source: number[];
  target: number[];
  value: number;
  gain: number;
  quantile: number;
};

const useTravel = (): Travel => {
  const txQueue = useTransactionQueue();
  const [travelArcs, setTravelArcs] = useState<TravelArc[]>();

  return {
    travel: (travellerId, destinationId) => {
      txQueue.add(
        createCall.travel({
          travellerId,
          destinationId,
        })
      );
    },
    setTravelArcs: (location: number, assets: number[]) => {
      console.log(getTravelArcs(location, assets));
      setTravelArcs(() => getTravelArcs(location, assets) as any);
    },
    travelArcs,
  };
};

export default useTravel;
