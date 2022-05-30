import { useStarknetInvoke } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { toFelt } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { useExchangeContract } from './settling/stark-contracts';

export type ResourceQty = {
  resourceId: number;
  qty: number;
};

export const useSwapResources = () => {
  const { contract: exchangeContract } = useExchangeContract();
  const {
    data: buyTokensData,
    loading: buyTokensLoading,
    invoke: invokeBuyTokens,
    error: buyTokensError,
  } = useStarknetInvoke({
    contract: exchangeContract,
    method: 'buy_tokens',
  });

  const buyTokens = (
    maxAmount: BigNumber,
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    invokeBuyTokens({
      args: [
        bnToUint256(maxAmount.toHexString()),
        tokenIds.map((value) => bnToUint256(value)),
        tokenAmounts.map((value) =>
          bnToUint256(BigNumber.from(value).toHexString())
        ),
        toFelt(deadline),
      ],
    });
  };
  return {
    buyTokens,
    buyTokensData,
    buyTokensLoading,
    buyTokensError,
  };
};
