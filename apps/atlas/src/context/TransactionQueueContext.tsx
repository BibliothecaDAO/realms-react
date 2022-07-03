import { useStarknetTransactionManager } from '@starknet-react/core';
import { getStarknet } from 'get-starknet';
import { createContext, useState, useContext, useEffect } from 'react';
import type { AddTransactionResponse, Call } from 'starknet';
import usePrevious from '@/hooks/usePrevious';
type Tx = Call & { status: 'ENQUEUED'; metadata?: any };

interface Simulation {
  status: 'loading' | 'success' | 'error';
  error?: any;
}

interface TransactionQueue {
  add: (tx: Call | Call[]) => void;
  transactions: Tx[];
  empty: () => void;
  simulation: Simulation;
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
  const [loadSim, setLoadSim] = useState(false);
  const prevLoadingSimulation = usePrevious(loadSim);
  const [simError, setSimError] = useState<any>();

  const add = (tx: Call[] | Call) => {
    if (Array.isArray(tx)) {
      setTx((prev) =>
        prev.concat(tx.map((t) => ({ ...t, status: 'ENQUEUED' })))
      );
    } else {
      setTx((prev) => prev.concat({ ...tx, status: 'ENQUEUED' }));
    }

    setLoadSim(true);
  };

  const empty = () => {
    setTx([]);
  };

  const txManager = useStarknetTransactionManager();

  const simulate = async () => {
    console.log('Running simulation');
    const starknet = getStarknet();
    setSimError(undefined);
    try {
      const res = await starknet.account.estimateFee(txs);
      console.log('simulation response', res);
      return res;
    } catch (e: any) {
      console.error('error while simulation txs:', e);
      setSimError(e);
    } finally {
      setLoadSim(false);
    }
  };

  useEffect(() => {
    if (!prevLoadingSimulation && loadSim) {
      simulate();
    }
  }, [loadSim, txs]);

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

  const simulation: Simulation = {
    status: loadSim ? 'loading' : simError ? 'error' : 'success',
    error: simError,
  };

  return (
    <TransactionQueueContext.Provider
      value={{ add, empty, transactions: txs, simulation, executeMulticall }}
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
