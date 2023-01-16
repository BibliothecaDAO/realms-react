import { ResourceIcon } from '@bibliotheca-dao/ui-lib';
import { formatEther } from '@ethersproject/units';
import { useStarknetInvoke } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { number, uint256 } from 'starknet';
import { findResourceById } from '@/constants/resources';
import { useCommandList } from '@/context/CommandListContext';
import { uint256ToRawCalldata } from '@/util/rawCalldata';
import type { CallAndMetadata, RealmsTransactionRenderConfig } from '../types';
import { ModuleAddr, useExchangeContract } from './settling/stark-contracts';
import useTxCallback from './useTxCallback';

export const Entrypoints = {
  buyTokens: 'buy_tokens',
  sellTokens: 'sell_tokens',
  addLiquidity: 'add_liquidity',
  removeLiquidity: 'remove_liquidity',
};

export const createCall: Record<string, (args: any) => CallAndMetadata> = {
  buyTokens: (args: {
    maxAmount: BigNumber;
    tokenIds: number[];
    tokenAmounts: BigNumber[];
    deadline: number;
  }) => ({
    contractAddress: ModuleAddr.Exchange,
    entrypoint: Entrypoints.buyTokens,
    calldata: [
      ...uint256ToRawCalldata(
        uint256.bnToUint256(args.maxAmount.toHexString())
      ),
      args.tokenIds.length,
      ...args.tokenIds
        .map((value) => uint256ToRawCalldata(uint256.bnToUint256(value)))
        .flat(1),
      args.tokenAmounts.length,
      ...args.tokenAmounts
        .map((value) =>
          uint256ToRawCalldata(
            uint256.bnToUint256(BigNumber.from(value).toHexString())
          )
        )
        .flat(1),
      number.toFelt(args.deadline),
    ],
    metadata: {
      ...args,
      maxAmount: args.maxAmount,
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
      ...uint256ToRawCalldata(
        uint256.bnToUint256(args.minAmount.toHexString())
      ),
      args.tokenIds.length,
      ...args.tokenIds
        .map((value) => uint256ToRawCalldata(uint256.bnToUint256(value)))
        .flat(1),
      args.tokenAmounts.length,
      ...args.tokenAmounts
        .map((value) =>
          uint256ToRawCalldata(
            uint256.bnToUint256(BigNumber.from(value).toHexString())
          )
        )
        .flat(1),
      number.toFelt(args.deadline),
    ],
    metadata: {
      ...args,
      minAmount: args.minAmount,
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
          uint256ToRawCalldata(
            uint256.bnToUint256(BigNumber.from(value).toHexString())
          )
        )
        .flat(1),
      args.tokenIds.length,
      ...args.tokenIds
        .map((value) => uint256ToRawCalldata(uint256.bnToUint256(value)))
        .flat(1),
      args.tokenAmounts.length,
      ...args.tokenAmounts
        .map((value) =>
          uint256ToRawCalldata(
            uint256.bnToUint256(BigNumber.from(value).toHexString())
          )
        )
        .flat(1),
      number.toFelt(args.deadline),
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
          uint256ToRawCalldata(
            uint256.bnToUint256(BigNumber.from(value).toHexString())
          )
        )
        .flat(1),
      args.tokenIds.length,
      ...args.tokenIds
        .map((value) => uint256ToRawCalldata(uint256.bnToUint256(value)))
        .flat(1),
      args.tokenAmounts.length,
      ...args.tokenAmounts
        .map((value) =>
          uint256ToRawCalldata(
            uint256.bnToUint256(BigNumber.from(value).toHexString())
          )
        )
        .flat(1),
      args.lpAmounts.length,
      ...args.lpAmounts
        .map((value) =>
          uint256ToRawCalldata(
            uint256.bnToUint256(BigNumber.from(value).toHexString())
          )
        )
        .flat(1),
      number.toFelt(args.deadline),
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
        withTooltip
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
  const { tx, loading } = useTxCallback(
    transactionHash?.transaction_hash,
    (status) => {
      // Update state changes?
      return true;
    }
  );

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

  const txQueue = useCommandList();

  const buyTokens = (
    maxAmount: BigNumber,
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    if (loading) {
      return;
    }
    const insertFirst = Boolean(sessionStorage.getItem('insertAsFirstTx'));
    if (insertFirst) {
      sessionStorage.removeItem('insertAsFirstTx');
    }
    txQueue.add(
      createCall.buyTokens({
        maxAmount,
        tokenIds,
        tokenAmounts,
        deadline,
      }),
      insertFirst
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

  const txQueue = useCommandList();

  const sellTokens = (
    minAmount: BigNumber,
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    if (loading) {
      return;
    }
    const insertFirst = Boolean(sessionStorage.getItem('insertAsFirstTx'));
    if (insertFirst) {
      sessionStorage.removeItem('insertAsFirstTx');
    }
    txQueue.add(
      createCall.sellTokens({
        minAmount,
        tokenIds,
        tokenAmounts,
        deadline,
      }),
      insertFirst
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

  const txQueue = useCommandList();

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

  const txQueue = useCommandList();

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
