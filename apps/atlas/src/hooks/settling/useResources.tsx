import { useStarknetInvoke } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import {
  DAY,
  MAX_DAYS_ACCURED,
  BASE_RESOURCES_PER_DAY,
  PILLAGE_AMOUNT,
} from '@/constants/buildings';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { Realm } from '@/generated/graphql';
import {
  ModuleAddr,
  useResources1155Contract,
} from '@/hooks/settling/stark-contracts';
import type {
  RealmsCall,
  AvailableResources,
  RealmsTransactionRenderConfig,
} from '@/types/index';
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
  realmsResourcesDetails: AvailableResources;
  loading: boolean;
};

const useResources = (realm: Realm | undefined): Resources => {
  const { play } = useUiSounds(soundSelector.claim);

  const txQueue = useTransactionQueue();

  const [realmsResourcesDetails, setRealmsResourcesDetails] =
    useState<AvailableResources>({
      daysAccrued: 0,
      daysRemainder: 0,
      vaultAccrued: 0,
      vaultRemainder: 0,
      claimableResources: [],
      vaultResources: [],
    });

  const cachedDaysAccrued = parseInt(
    ((new Date().getTime() - realm?.lastClaimTime) / DAY / 1000).toFixed(2)
  );

  const cachedDaysRemained =
    (new Date().getTime() - realm?.lastClaimTime) % DAY;

  const cachedVaultDaysAccrued = parseInt(
    ((new Date().getTime() - realm?.lastVaultTime) / DAY / 1000).toFixed(2)
  );

  // adds the base amount to the claimable
  const maxResources =
    cachedDaysAccrued > MAX_DAYS_ACCURED
      ? BASE_RESOURCES_PER_DAY * MAX_DAYS_ACCURED
      : 0;

  const resourcesAccrued = cachedDaysAccrued * BASE_RESOURCES_PER_DAY;

  const vaultAccrued = resourcesAccrued * (PILLAGE_AMOUNT / 100);

  useEffect(() => {
    if (!realm) {
      return;
    }

    const resources = realm?.resources?.map((a) => {
      return (resourcesAccrued + maxResources).toLocaleString();
    });

    const vault = realm?.resources?.map((a) => {
      return vaultAccrued.toLocaleString();
    });

    setRealmsResourcesDetails({
      daysAccrued:
        cachedDaysAccrued > MAX_DAYS_ACCURED
          ? MAX_DAYS_ACCURED
          : cachedDaysAccrued,
      daysRemainder: cachedDaysRemained,
      vaultAccrued: cachedVaultDaysAccrued,
      vaultRemainder: 0,
      claimableResources: resources,
      vaultResources: vault,
    });
  }, [realm]);

  return {
    realmsResourcesDetails,
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
