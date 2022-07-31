import { useStarknetInvoke } from '@starknet-react/core';
import type { BigNumber } from 'ethers';
import { toBN, toFelt } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import type { RealmsCall } from '../types';
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

// TODO move lords out of this
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
  const { tx, loading } = useTxCallback(transactionHash, (status) => {
    // Update state changes?
    return true;
  });

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
    useNexusTransaction('deposit');
  const txQueue = useTransactionQueue();

  // txs.push({
  //   contractAddress: CM.Lords,
  //   entrypoint: 'approve',
  //   calldata: [
  //     toBN(CM.Exchange).toString(),
  //     ALLOWANCE_AMOUNT.toString(),
  //     0, // Extra felt for uint256
  //   ],
  //   metadata: {
  //     title: 'Lords Contract',
  //     description: 'Approve spending by Realms Exchange module',
  //   },
  // });

  const stakeLords = (lordsAmount: BigNumber, receiver: string) => {
    if (loading) {
      return;
    }

    const txs: RealmsCall[] = [];

    // Exchange approvals

    txs.push({
      contractAddress: ModuleAddr.Lords,
      entrypoint: 'approve',
      calldata: [
        toBN(ModuleAddr.Nexus).toString(),
        lordsAmount.toHexString(),
        0,
      ],
      metadata: {
        title: 'approve',
        description: 'approve lords for nexus',
      },
    });

    txs.push({
      contractAddress: ModuleAddr.Nexus,
      entrypoint: 'deposit',
      calldata: [lordsAmount.toHexString(), 0, toFelt(receiver)],
      metadata: {
        title: 'deposit',
        description: 'deposit',
      },
    });

    txQueue.executeMulticall(txs.map((t) => ({ ...t, status: 'ENQUEUED' })));
  };

  return {
    loading,
    stakeLords,
    transactionHash,
    invokeError,
  };
};

export const useWithdrawLords = () => {
  const { transactionHash, invoke, invokeError, loading } =
    useNexusTransaction('redeem');

  const withdrawLords = (lordsAmount: BigNumber, receiver: string) => {
    if (loading) {
      return;
    }

    invoke({
      metadata: {
        action: 'redeem',
        title: `withdraw from nexus - ${lordsAmount}`,
      },
      args: [
        bnToUint256(lordsAmount.toHexString()),
        toFelt(receiver),
        toFelt(receiver),
      ],
    });
  };

  return {
    loading,
    withdrawLords,
    transactionHash,
    invokeError,
  };
};
