import { useStarknetInvoke } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { toFelt } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import type { RealmsCall, RealmsTransactionRenderConfig } from '../types';
import { ModuleAddr, useExchangeContract } from './settling/stark-contracts';
import useTxCallback from './useTxCallback';

export type ResourceQty = {
  resourceId: number;
  qty: number;
};

export type LpQty = {
  resourceId: number;
  lpqty: number;
  currencyqty: number;
};

export const Entrypoints = {
  buyTokens: 'buy_tokens',
  sellTokens: 'sell_tokens',
  addLiquidity: 'add_liquidity',
  removeLiquidity: 'remove_liquidity',
};

export const createCall: Record<string, (args: any) => RealmsCall> = {
  [Entrypoints.buyTokens]: (args: {
    maxAmount: BigNumber;
    tokenIds: number[];
    tokenAmounts: BigNumber[];
    deadline: number;
  }) => ({
    contractAddress: ModuleAddr.Exchange,
    entrypoint: Entrypoints.buyTokens,
    calldata: [],
    metadata: {
      ...args,
      action: Entrypoints.buyTokens,
    },
  }),
  [Entrypoints.sellTokens]: (args: {
    minAmount: BigNumber;
    tokenIds: number[];
    tokenAmounts: BigNumber[];
    deadline: number;
  }) => ({
    contractAddress: ModuleAddr.Exchange,
    entrypoint: Entrypoints.sellTokens,
    calldata: [],
    metadata: {
      ...args,
      action: Entrypoints.sellTokens,
    },
  }),
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.buyTokens]: ({ metadata }, { isQueued }) => ({
    title: 'Buy Resources',
    description: `${isQueued ? 'Buy' : 'Buying'} ${
      metadata.tokenIds?.length ?? ''
    } resources from the market.`,
  }),
  [Entrypoints.sellTokens]: ({ metadata }, { isQueued }) => ({
    title: 'Sell Resources',
    description: `${isQueued ? 'Sell' : 'Selling'} ${
      metadata.tokenIds?.length ?? ''
    } resources from the market.`,
  }),
  [Entrypoints.addLiquidity]: ({ metadata }, { isQueued }) => ({
    title: 'Add Liquidity Pair',
    description: `${
      isQueued ? 'Add' : 'Adding'
    } liquidity for the resource market.`,
  }),
  [Entrypoints.removeLiquidity]: ({ metadata }, { isQueued }) => ({
    title: 'Remove Liquidity Pair',
    description: `${
      isQueued ? 'Remove' : 'Removing'
    } liquidity for the resource market`,
  }),
};

const useSwapResourcesTransaction = (method: string) => {
  const { contract: exchangeContract } = useExchangeContract();
  const {
    data: transactionHash,
    invoke,
    error: invokeError,
  } = useStarknetInvoke({
    contract: exchangeContract,
    method,
  });
  const { tx, loading } = useTxCallback(transactionHash, (status) => {
    // Update state changes?
    return true;
  });

  return {
    transactionHash: tx,
    invoke,
    invokeError,
    loading,
  };
};

export const useBuyResources = () => {
  const { transactionHash, invoke, invokeError, loading } =
    useSwapResourcesTransaction(Entrypoints.buyTokens);
  const buyTokens = (
    maxAmount: BigNumber,
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    if (loading) {
      return;
    }
    invoke({
      metadata: {
        action: Entrypoints.buyTokens,
        tokenIds,
        tokenAmounts,
      },
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
    loading,
    buyTokens,
    transactionHash,
    invokeError,
  };
};

export const useSellResources = () => {
  const { transactionHash, invoke, invokeError, loading } =
    useSwapResourcesTransaction(Entrypoints.sellTokens);

  const sellTokens = (
    minAmount: BigNumber,
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    if (loading) {
      return;
    }
    invoke({
      metadata: {
        action: Entrypoints.sellTokens,
        tokenIds,
        tokenAmounts,
      },
      args: [
        bnToUint256(minAmount.toHexString()),
        tokenIds.map((value) => bnToUint256(value)),
        tokenAmounts.map((value) =>
          bnToUint256(BigNumber.from(value).toHexString())
        ),
        toFelt(deadline),
      ],
    });
  };

  return {
    loading,
    sellTokens,
    transactionHash,
    invokeError,
  };
};

export const useAddLiquidity = () => {
  const { transactionHash, invoke, invokeError, loading } =
    useSwapResourcesTransaction(Entrypoints.addLiquidity);

  const addLiquidity = (
    maxCurrencyAmount: BigNumber[],
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    if (loading) {
      return;
    }
    invoke({
      metadata: {
        action: Entrypoints.addLiquidity,
        tokenIds,
        tokenAmounts,
      },
      args: [
        maxCurrencyAmount.map((value) =>
          bnToUint256(BigNumber.from(value).toHexString())
        ),
        tokenIds.map((value) => bnToUint256(value)),
        tokenAmounts.map((value) =>
          bnToUint256(BigNumber.from(value).toHexString())
        ),
        toFelt(deadline),
      ],
    });
  };

  return {
    loading,
    addLiquidity,
    transactionHash,
    invokeError,
  };
};

export const useRemoveLiquidity = () => {
  const { transactionHash, invoke, invokeError, loading } =
    useSwapResourcesTransaction(Entrypoints.removeLiquidity);

  const removeLiquidity = (
    minCurrencyAmount: BigNumber[],
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    lpAmounts: BigNumber[],
    deadline: number
  ) => {
    if (loading) {
      return;
    }
    invoke({
      metadata: {
        action: Entrypoints.removeLiquidity,
        tokenIds,
        tokenAmounts,
        lpAmounts,
      },
      args: [
        minCurrencyAmount.map((value) =>
          bnToUint256(BigNumber.from(value).toHexString())
        ),
        tokenIds.map((value) => bnToUint256(value)),
        tokenAmounts.map((value) =>
          bnToUint256(BigNumber.from(value).toHexString())
        ),
        lpAmounts.map((value) =>
          bnToUint256(BigNumber.from(value).toHexString())
        ),
        toFelt(deadline),
      ],
    });
  };

  return {
    loading,
    removeLiquidity,
    transactionHash,
    invokeError,
  };
};
