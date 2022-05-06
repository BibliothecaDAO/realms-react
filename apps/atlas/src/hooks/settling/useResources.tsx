import { useStarknetInvoke, useStarknetCall } from '@starknet-react/core';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';

import { useResourcesContract } from '@/hooks/settling/stark-contracts';

type Resources = {
  claim: () => void;
  upgrade: () => void;
  availableResources: AvailabeResources;
};
type AvailabeResources = {
  daysAccrued: number;
  remainder: number;
};
type useResourcesArgs = {
  token_id: number;
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
    data: availableResourcesData,
    loading,
    error,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'get_available_resources',
    args: [
      bnToUint256(toBN(args.token_id)),
      // Token IDs],
    ],
  });
  let availableResources: AvailabeResources;
  if (availableResourcesData && availableResourcesData[0]) {
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
    claim: () => {
      claimResourcesAction.invoke({
        args: [bnToUint256(toBN(args.token_id))],
      });
    },
    upgrade: () => {
      upgradeResourcesAction.invoke({
        args: [bnToUint256(toBN(args.token_id))],
      });
    },
  };
};

export default useResources;
