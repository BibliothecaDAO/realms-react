import { useStarknetTransactionManager } from '@starknet-react/core';
import { getStarknet } from 'get-starknet';
import { createContext, useState, useContext } from 'react';
import type { AddTransactionResponse, Call } from 'starknet';
type Tx = Call & { status: 'ENQUEUED'; metadata?: any };

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

  const executeMulticall = async (inline?: Tx[]) => {
    const starknet = getStarknet();
    await starknet.enable();

    const t = inline ? [...inline, ...txs] : txs;

    const resp = await starknet.account.execute(t);

    txManager.addTransaction({
      ...resp,
      status: 'TRANSACTION_RECEIVED',
      transactionHash: resp.transaction_hash,
      metadata: {
        title: 'Grouped Command',
        description:
          'This is a multicall. Descriptions of transactions inside coming soon.',
      },
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
