import { useEffect } from 'react';
import { number, uint256 } from 'starknet';
import { getRealmNameById } from '@/components/realms/RealmsGetters';
import { useCommandList } from '@/context/CommandListContext';
import type { Realm } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import type {
  CallAndMetadata,
  RealmsTransactionRenderConfig,
} from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';

export const Entrypoints = {
  create: 'create',
};

export const createCall: Record<string, (args: any) => CallAndMetadata> = {
  create: (args: { realmId; resourceId; laborUnits }) => ({
    contractAddress: ModuleAddr.Labor,
    entrypoint: Entrypoints.create,
    calldata: [
      ...uint256ToRawCalldata(uint256.bnToUint256(number.toBN(args.realmId))),
      ...uint256ToRawCalldata(
        uint256.bnToUint256(number.toBN(args.resourceId))
      ),
      args.laborUnits,
    ],
    metadata: { ...args, action: Entrypoints.create },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.create]: (tx, ctx) => ({
    title: `${ctx.isQueued ? 'Harvest' : 'Harvesting'} Resources`,
    description: `Creating Tools and Labor ${getRealmNameById(
      tx.metadata.realmId
    )}.`,
  }),
};

type Resources = {
  create: (resourceId) => void;
  loading: boolean;
};

const useLabor = (realm: Realm | undefined): Resources => {
  const { play } = useUiSounds(soundSelector.claim);

  const txQueue = useCommandList();

  return {
    create: (args: { resourceId; laborUnits }) => {
      play();
      txQueue.add(
        createCall.create({
          realmId: realm?.realmId,
          resourceId: args.resourceId,
          laborUnits: args.laborUnits,
        })
      );
    },
    loading: false,
  };
};

export default useLabor;
