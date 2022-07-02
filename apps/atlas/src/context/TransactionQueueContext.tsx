import { getStarknet } from 'get-starknet';
import { createContext, useState, useContext } from 'react';
import type { AddTransactionResponse, Call } from 'starknet';
type Tx = Call;

interface TransactionQueue {
  add: (tx: Tx[]) => void;
  transactions: Tx[];
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

  const add = (tx: Tx[]) => {
    setTx(tx);
  };

  const executeMulticall = async (transactions?: Tx[]) => {
    const starknet = getStarknet();
    await starknet.enable();
    return await starknet.account.execute(
      transactions ? [...transactions, ...txs] : txs
    );
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
