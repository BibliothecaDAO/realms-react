import { useEffect } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { Realm } from '@/generated/graphql';
import { ModuleAddr } from '@/hooks/settling/stark-contracts';
import type { RealmsCall, RealmsTransactionRenderConfig } from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import { useUiSounds, soundSelector } from '../useUiSounds';

export const Entrypoints = {
  claim: 'claim_resources',
};

export const createResourcesCall: Record<string, (args: any) => RealmsCall> = {
  claim: ({ realmId }) => ({
    contractAddress: ModuleAddr.ResourceGame,
    entrypoint: Entrypoints.claim,
    calldata: uint256ToRawCalldata(bnToUint256(toBN(realmId))),
    metadata: { realmId, action: Entrypoints.claim },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.claim]: (tx, ctx) => ({
    title: `${ctx.isQueued ? 'Harvest' : 'Harvesting'} Resources`,
    description: `Serfs gathering resources on Realm #${tx.metadata.realmId}.`,
  }),
};

type Resources = {
  claim: () => void;
  loading: boolean;
};

const useResources = (realm: Realm | undefined): Resources => {
  const { play } = useUiSounds(soundSelector.claim);

  const txQueue = useTransactionQueue();

  useEffect(() => {
    if (!realm) {
      return;
    }
  }, [realm]);

  return {
    claim: () => {
      play();
      txQueue.add(
        createResourcesCall.claim({
          realmId: realm?.realmId,
        })
      );
    },
    loading: false,
  };
};

export default useResources;
