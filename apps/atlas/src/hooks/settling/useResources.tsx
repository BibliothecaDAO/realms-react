import { useStarknetInvoke } from '@starknet-react/core';

import { useResourcesContract } from '@/hooks/settling/stark-contracts';

type Resources = {
  claim: () => void;
  upgrade: () => void;
};
type useResourcesArgs = {
  token_id?: number;
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

  return {
    claim: () => {
      claimResourcesAction.invoke({
        args: [args.token_id],
      });
    },
    upgrade: () => {
      upgradeResourcesAction.invoke({
        args: [args.token_id],
      });
    },
  };
};

export default useResources;
