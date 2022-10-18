import { useTransactionManager } from '@starknet-react/core';
import { useState, useEffect } from 'react';
import type { Status } from 'starknet';

// TODO - implement starknet-react callbacks once https://github.com/apibara/starknet-react/pull/173 is merged

const useTxCallback = (
  transactionHash: string | undefined,
  callback: (status: Status) => void
) => {
  const txManager = useTransactionManager();
  const tx = txManager.transactions.find((t) => t.hash == transactionHash);

  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    // Reset the execution state when transaction hash changes
    setExecuted(false);
  }, [transactionHash]);

  /* useEffect(() => {
    if (
      !executed &&
      !!transactionHash &&
      tx?.status &&
      (tx.status == 'ACCEPTED_ON_L1' ||
        tx.status == 'ACCEPTED_ON_L2' ||
        tx.status == 'REJECTED')
    ) {
      callback(tx.status);
      setExecuted(true);
    }
  }, [tx?.status, transactionHash]); */

  const loading = false;
  /* tx?.status == 'TRANSACTION_RECEIVED' ||
    tx?.status == 'RECEIVED' ||
    tx?.status == 'PENDING'; */

  return {
    loading,
    tx,
  };
};

export default useTxCallback;
