import { useTransactionManager } from '@starknet-react/core';
import { useState, useEffect } from 'react';
import type { Status } from 'starknet';

const useTxCallback = (
  transactionHash: string | undefined,
  callback: (status: Status) => void
) => {
  const txManager = useTransactionManager();
  const tx = txManager.transactions.find(
    (t) => t.transactionHash == transactionHash
  );

  const [executed, setExecuted] = useState(false);

  useEffect(() => {
    // Reset the execution state when transaction hash changes
    setExecuted(false);
  }, [transactionHash]);

  useEffect(() => {
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
  }, [tx?.status, transactionHash]);

  const loading =
    tx?.status == 'TRANSACTION_RECEIVED' ||
    tx?.status == 'RECEIVED' ||
    tx?.status == 'PENDING';

  return {
    loading,
    tx,
  };
};

export default useTxCallback;
