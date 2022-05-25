import { useStarknetInvoke, useStarknetCall } from '@starknet-react/core';
import type BN from 'bn.js';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';

import { useResourcesContract } from '@/hooks/settling/stark-contracts';
import { resources } from '@/util/resources';

type Resources = {
  claim: () => void;
  upgrade: (resourceId: number) => void;
  availableResources: AvailabeResources;
  claimableLords?: BN;
  claimableResources?: any;
};
type AvailabeResources = {
  daysAccrued: number;
  remainder: number;
};
type useResourcesArgs = {
  token_id: number;
  resources: any;
};

const useResources = (args: useResourcesArgs): Resources => {
  const { contract: resourcesContract } = useResourcesContract();

  const claimResourcesAction = useStarknetInvoke({
    contract: resourcesContract,
    method: 'claim_resources',
  });

  const upgradeResourcesAction = useStarknetInvoke({
    contract: resourcesContract,
    method: 'upgrade_resource',
  });

  const {
    data: allOutputData,
    loading: outputLoading,
    error: outputError,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'get_all_resource_claimable',
    args: [bnToUint256(toBN(args.token_id))],
  });

  const {
    data: availableResourcesData,
    loading,
    error,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'days_accrued',
    args: [
      bnToUint256(toBN(args.token_id)),
      // Token IDs],
    ],
  });

  let availableResources: AvailabeResources;
  if (availableResourcesData) {
    availableResources = {
      daysAccrued: availableResourcesData[0].toNumber(),
      remainder: availableResourcesData[1].toNumber(),
    };
  } else {
    availableResources = {
      daysAccrued: 0,
      remainder: 0,
    };
  }
  return {
    availableResources,
    claimableLords: allOutputData && uint256ToBN(allOutputData[1]),
    claimableResources:
      allOutputData &&
      allOutputData[0]?.map((resource) => uint256ToBN(resource)),
    claim: () => {
      claimResourcesAction.invoke({
        args: [bnToUint256(toBN(args.token_id))],
      });
    },
    upgrade: (resourceId: number) => {
      upgradeResourcesAction.invoke({
        args: [bnToUint256(toBN(args.token_id)), resourceId],
      });
    },
  };
};

export default useResources;
