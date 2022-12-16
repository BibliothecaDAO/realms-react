import { formatEther } from '@ethersproject/units';
import { useStarknetInvoke } from '@starknet-react/core';
import type { BigNumber } from 'ethers';
import { number, uint256 } from 'starknet';
import { useCommandList } from '@/context/CommandListContext';
import type { CallAndMetadata } from '../types';
import {
  useNexusContract,
  useLordsContract,
  ModuleAddr,
} from './settling/stark-contracts';
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
  deposit: 'deposit',
  redeem: 'redeem',
  approve: 'approve',
};

const useNexusTransaction = (method: string) => {
  const { contract: lordsContract } = useLordsContract();
  const {
    data: lordsTransactionHash,
    invoke: invokeLords,
    error: invokeLordsError,
  } = useStarknetInvoke({
    contract: lordsContract,
    method,
  });

  const { contract: nexusContract } = useNexusContract();
  const {
    data: transactionHash,
    invoke,
    error: invokeError,
  } = useStarknetInvoke({
    contract: nexusContract,
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
    invokeLords,
    nexusContract,
  };
};

export const useStakeLords = () => {
  const { transactionHash, invoke, invokeError, loading, nexusContract } =
    useNexusTransaction(Entrypoints.deposit);
  const txQueue = useCommandList();

  const stakeLords = (lordsAmount: BigNumber, receiver: string) => {
    if (loading) {
      return;
    }

    // We approve then deposit in a multicall
    const txs: CallAndMetadata[] = [];

    txs.push({
      contractAddress: ModuleAddr.Lords,
      entrypoint: Entrypoints.approve,
      calldata: [
        number.toBN(ModuleAddr.Nexus).toString(),
        lordsAmount.toHexString(),
        0,
      ],
      metadata: {
        title: 'Approve $Lords for Nexus',
        description: `You are approving ${(+formatEther(
          lordsAmount
        )).toLocaleString()} $LORDS to stake into the NEXUS.`,
      },
    });

    txs.push({
      contractAddress: ModuleAddr.Nexus,
      entrypoint: Entrypoints.deposit,
      calldata: [lordsAmount.toHexString(), 0, number.toFelt(receiver)],
      metadata: {
        title: 'Deposit into Nexus',
        description: `You are depositing ${(+formatEther(
          lordsAmount
        )).toLocaleString()} $LORDS into the Nexus`,
      },
    });

    txQueue.executeMulticall(txs.map((t) => ({ ...t, status: 'ENQUEUED' })));
  };

  const {
    transactionHash: redeemTxHash,
    invoke: redeemInvoke,
    loading: redeemLoading,
  } = useNexusTransaction(Entrypoints.redeem);

  const withdrawLords = (lordsAmount: BigNumber, receiver: string) => {
    if (loading) {
      return;
    }

    redeemInvoke({
      metadata: {
        title: 'Redeem $LORDS',
        description: `You are redeeming ${(+formatEther(
          lordsAmount
        )).toLocaleString()} $LORDS to stake into the NEXUS.`,
      },
      args: [
        uint256.bnToUint256(lordsAmount.toHexString()),
        number.toFelt(receiver),
        number.toFelt(receiver),
      ],
    });
  };

  return {
    loading: redeemLoading || loading,
    stakeLords,
    withdrawLords,
    transactionHash,
    invokeError,
  };
};
