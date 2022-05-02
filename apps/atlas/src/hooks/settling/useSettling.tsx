import { useStarknet, useStarknetInvoke } from '@starknet-react/core';

import { useSettlingContract } from '@/hooks/settling/stark-contracts';

type Settling = {
  settleRealm: (tokenId: number) => void;
  unsettleRealm: (tokenId: number) => void;
};

const useSettling = (): Settling => {
  const { account } = useStarknet();

  const { contract: settlingContract } = useSettlingContract();

  const settleRealmAction = useStarknetInvoke({
    contract: settlingContract,
    method: 'settle',
  });

  const unsettleRealmAction = useStarknetInvoke({
    contract: settlingContract,
    method: 'unsettle',
  });

  return {
    settleRealm: (tokenId: number) => {
      settleRealmAction.invoke({
        args: [tokenId],
      });
    },
    unsettleRealm: (tokenId: number) => {
      unsettleRealmAction.invoke({
        args: [tokenId],
      });
    },
  };
};

export default useSettling;
