import { useStarknetTransactionManager } from '@starknet-react/core';
import { getStarknet } from 'get-starknet';
import { createContext, useState, useContext } from 'react';
import type { AddTransactionResponse, Call } from 'starknet';
type Tx = Call & { status: 'ENQUEUED' };

interface TransactionQueue {
  add: (tx: Call[]) => void;
  transactions: Tx[];
  empty: () => void;
  executeMulticall: (transactions: Tx[]) => Promise<AddTransactionResponse>;
}

export const TransactionQueueContext = createContext<
  TransactionQueue | undefined
>(undefined);

export const TransactionQueueProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [txs, setTx] = useState<Tx[]>([]);

  const add = (tx: Call[]) => {
    setTx((prev) => prev.concat(tx.map((t) => ({ ...t, status: 'ENQUEUED' }))));
  };

  const empty = () => {
    setTx([]);
  };

  const txManager = useStarknetTransactionManager();

  const executeMulticall = async (transactions?: Tx[]) => {
    const starknet = getStarknet();
    await starknet.enable();
    const resp = await starknet.account.execute(
      transactions ? [...transactions, ...txs] : txs
    );

    txManager.addTransaction({
      ...resp,
      status: 'TRANSACTION_RECEIVED',
      transactionHash: resp.transaction_hash,
    });
    setTx([]);
    return resp;
  };

  return (
    <TransactionQueueContext.Provider
      value={{ add, empty, transactions: txs, executeMulticall }}
    >
      {children}
    </TransactionQueueContext.Provider>
  );
};

export const useTransactionQueue = () => {
  const txContext = useContext(TransactionQueueContext);
  if (txContext == undefined) {
    throw new Error(
      'useTransactionQueue must be used within a TransactionQueueProvider'
    );
  }
  return txContext;
};
