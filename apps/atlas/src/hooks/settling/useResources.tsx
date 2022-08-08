import { formatEther } from '@ethersproject/units';
import { useStarknetInvoke, useStarknetCall } from '@starknet-react/core';
import type BN from 'bn.js';
import { useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
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
  loadingClaimable: boolean;
};

type useResourcesArgs = {
  token_id: number | undefined;
  resources: any | undefined;
};

const useResources = (args: useResourcesArgs): Resources => {
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

  const claimResourcesAction = useStarknetInvoke({
    contract: resourcesContract,
    method: Entrypoints.claim,
  });

  const {
    data: allOutputData,
    loading: outputLoading,
    error: outputError,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'get_all_resource_claimable',
    args: [bnToUint256(toBN(args.token_id ?? 0))],
  });

  const {
    data: allResourceVault,
    loading: allResourceVaultLoading,
    error: allResourceVaultError,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'get_all_vault_raidable',
    args: [bnToUint256(toBN(args.token_id ?? 0))],
  });

  const {
    data: availableResourcesData,
    loading,
    error,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'days_accrued',
    args: [bnToUint256(toBN(args.token_id ?? 0))],
  });

  const {
    data: availableVaultDays,
    loading: loadingAvailableVaultDays,
    error: errorVaultDays,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'get_available_vault_days',
    args: [bnToUint256(toBN(args.token_id ?? 0))],
  });

  useEffect(() => {
    if (
      !availableResourcesData ||
      !availableResourcesData[0] ||
      !allResourceVault ||
      !allResourceVault[0] ||
      !allOutputData ||
      !allOutputData[0] ||
      !availableVaultDays ||
      !availableVaultDays[0]
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
      daysAccrued: availableResourcesData[0].toNumber(),
      daysRemainder: availableResourcesData[1].toNumber(),
      vaultAccrued: availableVaultDays[0].toNumber(),
      vaultRemainder: availableVaultDays[1].toNumber(),
      claimableResources: resources,
      vaultResources: vault,
    });
  }, [
    availableResourcesData,
    allResourceVault,
    allOutputData,
    availableVaultDays,
  ]);

  return {
    realmsResourcesDetails,
    claim: () => {
      claimResourcesAction.invoke({
        args: [bnToUint256(toBN(args.token_id ?? 0))],
        metadata: {
          action: 'harvest_resources',
          realmId: args.token_id,
        },
      });
    },
    loadingClaimable: outputLoading,
  };
};

export default useResources;
