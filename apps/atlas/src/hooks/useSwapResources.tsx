import { useStarknetInvoke } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { toFelt } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { useExchangeContract } from './settling/stark-contracts';
import useTxCallback from './useTxCallback';

export type ResourceQty = {
  resourceId: number;
  qty: number;
};

export const useSwapResources = () => {
  const { contract: exchangeContract } = useExchangeContract();
  const {
    data: transactionHash,
    invoke: invokeBuyTokens,
    error: invokeError,
  } = useStarknetInvoke({
    contract: exchangeContract,
    method: 'buy_tokens',
  });
  const { tx, loading } = useTxCallback(transactionHash, (status) => {
    // Update state changes?
    return true;
  });

  const buyTokens = (
    maxAmount: BigNumber,
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    if (loading) {
      return;
    }
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
    transactionResult: tx,
    loading,
    buyTokens,
    transactionHash,
    invokeError,
  };
};
