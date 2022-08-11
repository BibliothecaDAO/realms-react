import { formatEther } from '@ethersproject/units';
import { useStarknetInvoke, useStarknetCall } from '@starknet-react/core';
import type BN from 'bn.js';
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import { DAY, MAX_DAYS_ACCURED } from '@/constants/buildings';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { Realm } from '@/generated/graphql';
import {
  ModuleAddr,
  useResourcesContract,
} from '@/hooks/settling/stark-contracts';
import type { RealmsCall, AvailableResources } from '@/types/index';
import { uint256ToRawCalldata } from '@/util/rawCalldata';

export const Entrypoints = {
  claim: 'claim_resources',
};

export const createCall: Record<string, (args: any) => RealmsCall> = {
  claim: ({ realmId }) => ({
    contractAddress: ModuleAddr.ResourceGame,
    entrypoint: Entrypoints.claim,
    calldata: uint256ToRawCalldata(bnToUint256(toBN(realmId))),
    metadata: { realmId, action: Entrypoints.claim },
  }),
};

type Resources = {
  claim: () => void;
  realmsResourcesDetails: AvailableResources;
  loading: boolean;
};

const useResources = (realm: Realm | undefined): Resources => {
  const [realmsResourcesDetails, setRealmsResourcesDetails] =
    useState<AvailableResources>({
      daysAccrued: 0,
      daysRemainder: 0,
      vaultAccrued: 0,
      vaultRemainder: 0,
      claimableResources: [],
      vaultResources: [],
    });

  const { contract: resourcesContract } = useResourcesContract();

  const txQueue = useTransactionQueue();

  const claimResourcesAction = useStarknetInvoke({
    contract: resourcesContract,
    method: Entrypoints.claim,
  });

  const {
    data: allOutputData,
    loading: claimableLoading,
    error: outputError,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'get_all_resource_claimable',
    args: [bnToUint256(toBN(realm?.realmId ?? 0))],
  });

  const {
    data: allResourceVault,
    loading: vaultLoading,
    error: allResourceVaultError,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'get_all_vault_raidable',
    args: [bnToUint256(toBN(realm?.realmId ?? 0))],
  });

  // CACHED IN INDEXER
  // const {
  //   data: daysAccrued,
  //   loading: daysAccruedLoading,
  //   error,
  // } = useStarknetCall({
  //   contract: resourcesContract,
  //   method: 'days_accrued',
  //   args: [bnToUint256(toBN(realm?.realmId ?? 0))],
  // });

  // const {
  //   data: availableVaultDays,
  //   loading: availableVaultDaysLoading,
  //   error: errorVaultDays,
  // } = useStarknetCall({
  //   contract: resourcesContract,
  //   method: 'get_available_vault_days',
  //   args: [bnToUint256(toBN(realm?.realmId ?? 0))],
  // });

  const cachedDaysAccrued = parseInt(
    ((new Date().getTime() - realm?.lastClaimTime) / DAY / 1000).toFixed(2)
  );

  const cachedDaysRemained =
    (new Date().getTime() - realm?.lastClaimTime) % DAY;

  const cachedVaultDaysAccrued = parseInt(
    ((new Date().getTime() - realm?.lastVaultTime) / DAY / 1000).toFixed(2)
  );

  useEffect(() => {
    if (
      !allResourceVault ||
      !allResourceVault[0] ||
      !allOutputData ||
      !allOutputData[0]
    ) {
      return;
    }

    const resources = allOutputData[0]?.map((a) => {
      return (+formatEther(uint256ToBN(a).toString(10))).toLocaleString();
    });

    const vault = allResourceVault[0]?.map((a) => {
      return (+formatEther(uint256ToBN(a).toString(10))).toLocaleString();
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
  }, [allResourceVault, allOutputData]);

  return {
    realmsResourcesDetails,
    claim: () => {
      txQueue.add(
        createCall.claim({
          realmId: realm?.realmId,
        })
      );
    },
    loading: claimableLoading || vaultLoading,
  };
};

export default useResources;
