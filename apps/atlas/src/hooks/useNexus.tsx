import { useStarknetInvoke } from '@starknet-react/core';
import type { BigNumber } from 'ethers';
import { toFelt } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { useNexusContract, useLordsContract } from './settling/stark-contracts';
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
  };
};

export const useStakeLords = () => {
  const { transactionHash, invoke, invokeError, loading } =
    useNexusTransaction('deposit');

  const stakeLords = (lordsAmount: BigNumber, receiver: string) => {
    if (loading) {
      return;
    }
    console.log(toFelt(receiver));
    invoke({
      metadata: {
        action: 'deposit',
        title: 'deposit',
      },
      args: [bnToUint256(lordsAmount.toHexString()), toFelt(receiver)],
    });
  };

  return {
    loading,
    stakeLords,
    transactionHash,
    invokeError,
  };
};

export const useApproveLords = () => {
  const { transactionHash, invokeLords, invokeError, loading } =
    useNexusTransaction('approve');

  const approveLords = (spender: string, lordsAmount: BigNumber) => {
    if (loading) {
      return;
    }

    invokeLords({
      metadata: {
        action: 'approve',
        title: 'Approval Lords For Nexus',
      },
      args: [toFelt(spender), bnToUint256(lordsAmount.toHexString())],
    });
  };

  return {
    loading,
    approveLords,
    transactionHash,
    invokeError,
  };
};
