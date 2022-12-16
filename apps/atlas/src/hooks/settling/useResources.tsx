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
  claim: 'claim_resources',
};

export const createResourcesCall: Record<
  string,
  (args: any) => CallAndMetadata
> = {
  claim: ({ realmId }) => ({
    contractAddress: ModuleAddr.ResourceGame,
    entrypoint: Entrypoints.claim,
    calldata: uint256ToRawCalldata(uint256.bnToUint256(number.toBN(realmId))),
    metadata: { realmId, action: Entrypoints.claim },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.claim]: (tx, ctx) => ({
    title: `${ctx.isQueued ? 'Harvest' : 'Harvesting'} Resources`,
    description: `Serfs gathering resources on ${getRealmNameById(
      tx.metadata.realmId
    )}.`,
  }),
};

type Resources = {
  claim: () => void;
  loading: boolean;
};

const useResources = (realm: Realm | undefined): Resources => {
  const { play } = useUiSounds(soundSelector.claim);

  const txQueue = useCommandList();

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
