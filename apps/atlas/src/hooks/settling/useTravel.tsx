/* eslint-disable @typescript-eslint/naming-convention */

import { useState } from 'react';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import {
  fetchRealmNameById,
  getTravelArcs,
} from '@/components/realms/RealmsGetters';
import { useAtlasContext } from '@/context/AtlasContext';
import { useCommandList } from '@/context/CommandListContext';
import type {
  CallAndMetadata,
  RealmsTransactionRenderConfig,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { ModuleAddr } from './stark-contracts';

export const Assets = {
  realms: 3,
};

export const Entrypoints = {
  travel: 'travel',
};

export const createCall: Record<string, (args: any) => CallAndMetadata> = {
  travel: (args: {
    armyId: number;
    travellerId: number;
    destinationId: number;
  }) => ({
    contractAddress: ModuleAddr.Travel,
    entrypoint: Entrypoints.travel,
    calldata: [
      Assets.realms,
      ...uint256ToRawCalldata(bnToUint256(args.travellerId)),
      args.armyId,
      Assets.realms,
      ...uint256ToRawCalldata(bnToUint256(args.destinationId)),
      0, // nested destination is always 0 for now.
    ],
    metadata: {
      ...args,
      action: Entrypoints.travel,
    },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.travel]: (tx, _context) => ({
    title: `Traveling ${fetchRealmNameById(tx.metadata.travellerId)}`,
    description: `Army ${tx.metadata.armyId} of ${fetchRealmNameById(
      tx.metadata.travellerId
    )} -> ${fetchRealmNameById(tx.metadata.destinationId)}`,
  }),
};

export type Travel = {
  travel: (armyId: number, travellerId: number, destinationId: number) => void;
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
  const txQueue = useCommandList();
  const [travelArcs, setTravelArcs] = useState<TravelArc[]>();

  return {
    travel: (armyId, travellerId, destinationId) => {
      txQueue.add(
        createCall.travel({
          armyId,
          travellerId,
          destinationId,
        })
      );
    },
    setTravelArcs: (location: number, assets: number[]) => {
      setTravelArcs(() => getTravelArcs(location, assets) as any);
    },
    travelArcs,
  };
};

export default useTravel;
