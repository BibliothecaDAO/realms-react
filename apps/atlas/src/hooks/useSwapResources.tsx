import { ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { formatEther } from '@ethersproject/units';
import { useStarknetInvoke } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { toFelt } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { findResourceById } from '@/constants/resources';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
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
  buyTokens: (args: {
    maxAmount: BigNumber;
    tokenIds: number[];
    tokenAmounts: BigNumber[];
    deadline: number;
  }) => ({
    contractAddress: ModuleAddr.Exchange,
    entrypoint: Entrypoints.buyTokens,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(args.maxAmount.toHexString())),
      args.tokenIds.length,
      ...args.tokenIds
        .map((value) => uint256ToRawCalldata(bnToUint256(value)))
        .flat(1),
      args.tokenAmounts.length,
      ...args.tokenAmounts
        .map((value) =>
          uint256ToRawCalldata(bnToUint256(BigNumber.from(value).toHexString()))
        )
        .flat(1),
      toFelt(args.deadline),
    ],
    metadata: {
      ...args,
      action: Entrypoints.buyTokens,
    },
  }),
  sellTokens: (args: {
    minAmount: BigNumber;
    tokenIds: number[];
    tokenAmounts: BigNumber[];
    deadline: number;
  }) => ({
    contractAddress: ModuleAddr.Exchange,
    entrypoint: Entrypoints.sellTokens,
    calldata: [
      ...uint256ToRawCalldata(bnToUint256(args.minAmount.toHexString())),
      args.tokenIds.length,
      ...args.tokenIds
        .map((value) => uint256ToRawCalldata(bnToUint256(value)))
        .flat(1),
      args.tokenAmounts.length,
      ...args.tokenAmounts
        .map((value) =>
          uint256ToRawCalldata(bnToUint256(BigNumber.from(value).toHexString()))
        )
        .flat(1),
      toFelt(args.deadline),
    ],
    metadata: {
      ...args,
      action: Entrypoints.sellTokens,
    },
  }),
  addLiquidity: (args: {
    maxCurrencyAmount: BigNumber[];
    tokenIds: number[];
    tokenAmounts: BigNumber[];
    deadline: number;
  }) => ({
    contractAddress: ModuleAddr.Exchange,
    entrypoint: Entrypoints.addLiquidity,
    calldata: [
      args.maxCurrencyAmount.length,
      ...args.maxCurrencyAmount
        .map((value) =>
          uint256ToRawCalldata(bnToUint256(BigNumber.from(value).toHexString()))
        )
        .flat(1),
      args.tokenIds.length,
      ...args.tokenIds
        .map((value) => uint256ToRawCalldata(bnToUint256(value)))
        .flat(1),
      args.tokenAmounts.length,
      ...args.tokenAmounts
        .map((value) =>
          uint256ToRawCalldata(bnToUint256(BigNumber.from(value).toHexString()))
        )
        .flat(1),
      toFelt(args.deadline),
    ],
    metadata: {
      ...args,
      action: Entrypoints.addLiquidity,
    },
  }),
  removeLiquidity: (args: {
    minCurrencyAmount: BigNumber[];
    tokenIds: number[];
    tokenAmounts: BigNumber[];
    lpAmounts: BigNumber[];
    deadline: number;
  }) => ({
    contractAddress: ModuleAddr.Exchange,
    entrypoint: Entrypoints.removeLiquidity,
    calldata: [
      args.minCurrencyAmount.length,
      ...args.minCurrencyAmount
        .map((value) =>
          uint256ToRawCalldata(bnToUint256(BigNumber.from(value).toHexString()))
        )
        .flat(1),
      args.tokenIds.length,
      ...args.tokenIds
        .map((value) => uint256ToRawCalldata(bnToUint256(value)))
        .flat(1),
      args.tokenAmounts.length,
      ...args.tokenAmounts
        .map((value) =>
          uint256ToRawCalldata(bnToUint256(BigNumber.from(value).toHexString()))
        )
        .flat(1),
      args.lpAmounts.length,
      ...args.lpAmounts
        .map((value) =>
          uint256ToRawCalldata(bnToUint256(BigNumber.from(value).toHexString()))
        )
        .flat(1),
      toFelt(args.deadline),
    ],
    metadata: {
      ...args,
      action: Entrypoints.removeLiquidity,
    },
  }),
};

export const CartResources = ({ tokenId, amounts }) => {
  return (
    <div className="flex flex-col items-center mb-4 mr-4">
      <ResourceIcon
        className="self-center w-4"
        resource={findResourceById(tokenId)?.trait?.replace(' ', '') || ''}
        size="md"
      />
      <div>{(+formatEther(amounts)).toLocaleString()}</div>
    </div>
  );
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  [Entrypoints.buyTokens]: ({ metadata }, { isQueued }) => ({
    title: 'Buy Resources',
    description: [
      `${isQueued ? 'Buy' : 'Buying'} ${
        metadata.tokenIds?.length ?? ''
      } resources from the market.`,
      <div key="icons" className="flex flex-wrap mt-4">
        {metadata.tokenIds.map((tokenId, i) => (
          <CartResources
            key={i}
            tokenId={tokenId}
            amounts={metadata.tokenAmounts[i]}
          />
        ))}
      </div>,
    ] as any,
  }),
  [Entrypoints.sellTokens]: ({ metadata }, { isQueued }) => ({
    title: 'Sell Resources',
    description: [
      `${isQueued ? 'Sell' : 'Selling'} ${
        metadata.tokenIds?.length ?? ''
      } resources from the market.`,
      <div key="icons" className="flex flex-wrap mt-4">
        {metadata.tokenIds.map((tokenId, i) => (
          <CartResources
            key={i}
            tokenId={tokenId}
            amounts={metadata.tokenAmounts[i]}
          />
        ))}
      </div>,
    ] as any,
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

  const txQueue = useTransactionQueue();

  const buyTokens = (
    maxAmount: BigNumber,
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    if (loading) {
      return;
    }
    txQueue.add(
      createCall.buyTokens({
        maxAmount,
        tokenIds,
        tokenAmounts,
        deadline,
      })
    );
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

  const txQueue = useTransactionQueue();

  const sellTokens = (
    minAmount: BigNumber,
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    if (loading) {
      return;
    }
    txQueue.add(
      createCall.sellTokens({
        minAmount,
        tokenIds,
        tokenAmounts,
        deadline,
      })
    );
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

  const txQueue = useTransactionQueue();

  const addLiquidity = (
    maxCurrencyAmount: BigNumber[],
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    if (loading) {
      return;
    }
    txQueue.add(
      createCall.addLiquidity({
        maxCurrencyAmount,
        tokenIds,
        tokenAmounts,
        deadline,
      })
    );
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

  const txQueue = useTransactionQueue();

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
    txQueue.add(
      createCall.removeLiquidity({
        minCurrencyAmount,
        tokenIds,
        tokenAmounts,
        lpAmounts,
        deadline,
      })
    );
  };

  return {
    loading,
    removeLiquidity,
    transactionHash,
    invokeError,
  };
};
