import { useStarknetTransactionManager } from '@starknet-react/core';
import { getStarknet } from 'get-starknet';
import { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import type { InvokeFunctionResponse } from 'starknet';
import { Scroll } from '@/shared/Icons';
import { ENQUEUED_STATUS } from '../constants';
import type { RealmsCall } from '../types';

type Call = RealmsCall;
type Tx = Call & { status: typeof ENQUEUED_STATUS };
interface TransactionQueue {
  add: (tx: Call | Call[]) => void;
  transactions: Tx[];
  remove: (tx: Tx) => void;
  empty: () => void;
  reorderQueue: (dragIndex: number, hoverIndex: number) => void;
  executeMulticall: (transactions: Tx[]) => Promise<InvokeFunctionResponse>;
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

  const add = (tx: Call[] | Call) => {
    const scrollIcon = <Scroll className="w-6 fill-current" />;

    if (Array.isArray(tx)) {
      toast(`${tx.length} Command(s) Queued`, {
        icon: scrollIcon,
      });
      setTx((prev) =>
        prev.concat(tx.map((t) => ({ ...t, status: ENQUEUED_STATUS })))
      );
    } else {
      toast('Command Queued: ' + tx.metadata?.action, {
        icon: scrollIcon,
      });
      setTx((prev) => prev.concat({ ...tx, status: ENQUEUED_STATUS }));
    }
  };

  const remove = (tx: Tx) => {
    const i = txs.indexOf(tx);
    setTx((prev) => {
      const next = [...prev];
      next.splice(i, 1);
      return next;
    });
  };

  const reorderQueue = (dragIndex: number, hoverIndex: number) => {
    setTx((prev) => {
      const next = [...prev];
      next.splice(hoverIndex, 0, ...next.splice(dragIndex, 1));
      return next;
    });
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
        multicalls: t.map((tt) => ({ ...tt, status: 'TRANSACTION_RECEIVED' })),
      },
    });
    setTx([]);
    return resp;
  };

  return (
    <TransactionQueueContext.Provider
      value={{
        add,
        remove,
        empty,
        reorderQueue,
        transactions: txs,
        executeMulticall,
      }}
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
