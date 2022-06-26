import { getStarknet } from 'get-starknet';
import { createContext, useState, useContext } from 'react';
import type { Call } from 'starknet';
type Tx = Call;

interface TransactionQueue {
  add: (tx: Tx) => void;
  transactions: Tx[];
  executeMulticall: () => Promise<string>;
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

  const add = (tx: Tx) => {
    setTx((prev) => prev.concat(tx));
  };

  const executeMulticall = async () => {
    const starknet = getStarknet();
    await starknet.enable();

    const calls = txs;

    const resp = await starknet.account.execute(calls);
    return resp.transaction_hash;
  };

  return (
    <TransactionQueueContext.Provider
      value={{ add, transactions: txs, executeMulticall }}
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
