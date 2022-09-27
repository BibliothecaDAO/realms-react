import { useStarknetInvoke } from '@starknet-react/core';

import { useWonderContract } from '@/hooks/settling/stark-contracts';

type Wonder = {
  payUpkeep: (epoch: number) => void;
  claimTax: () => void;
};
type useWonderArgs = {
  token_id?: number;
};

const useWonder = (args: useWonderArgs): Wonder => {
  const { contract: wonderContract } = useWonderContract();

  const payUpkeepAction = useStarknetInvoke({
    contract: wonderContract,
    method: 'pay_wonder_upkeep',
  });

  const claimTaxAction = useStarknetInvoke({
    contract: wonderContract,
    method: 'claim_wonder_tax',
  });

  return {
    payUpkeep: (epoch) => {
      payUpkeepAction.invoke({
        args: [epoch, args.token_id],
      });
    },
    claimTax: () => {
      claimTaxAction.invoke({
        args: [args.token_id],
      });
    },
  };
};

export default useWonder;
