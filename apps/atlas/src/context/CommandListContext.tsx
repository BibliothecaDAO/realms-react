import {
  useTransactionManager,
  useStarknetExecute,
} from '@starknet-react/core';
import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { InvokeFunctionResponse } from 'starknet';
import { Scroll } from '@/components/ui/Icons';
import { ENQUEUED_STATUS } from '../constants';
import type { CallAndMetadata } from '../types';

type Call = CallAndMetadata;
export type Tx = Call & { status: typeof ENQUEUED_STATUS; keyId?: string };

interface CommandList {
  add: (tx: Call | Call[]) => void;
  transactions: Tx[];
  remove: (tx: Tx) => void;
  empty: () => void;
  reorderQueue: (dragIndex: number, hoverIndex: number) => void;
  executeMulticall: (transactions?: Tx[]) => Promise<InvokeFunctionResponse>;
}

export const CommandListContext = createContext<CommandList | undefined>(
  undefined
);

export const CommandListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [txs, setTx] = useState<Tx[]>([]);
  const [inlineTx, setInlineTx] = useState<Tx[]>([]);

  const { addTransaction } = useTransactionManager();
  const { execute } = useStarknetExecute({ calls: txs });

  const add = (tx: Call[] | Call) => {
    const scrollIcon = <Scroll className="w-6 fill-current" />;

    console.log(tx);

    if (Array.isArray(tx)) {
      toast(`${tx.length} Command(s) Queued`, {
        icon: scrollIcon,
      });
      setTx((prev) =>
        prev.concat(
          tx.map((t) => ({
            ...t,
            status: ENQUEUED_STATUS,
            keyId: Math.random().toString(16).slice(2),
          }))
        )
      );
    } else {
      toast('Command Queued: ' + tx.metadata?.action, {
        icon: scrollIcon,
      });
      setTx((prev) =>
        prev.concat({
          ...tx,
          status: ENQUEUED_STATUS,
          keyId: Math.random().toString(16).slice(2),
        })
      );
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

  const executeMulticall = async (inline?: Tx[]) => {
    console.log(inline);
    /* const starknet = getStarknet();
    await starknet.enable();

    const t = inline ? [...inline, ...txs] : txs;

    const resp = await starknet.account.execute(t); */

    setTx((prev) => {
      if (inline) {
        return prev.concat(
          inline.map((t) => ({ ...t, status: ENQUEUED_STATUS }))
        );
      } else {
        return prev;
      }
    });

    const resp = await execute();

    addTransaction({
      ...resp,
      hash: resp.transaction_hash,
      metadata: {
        multicalls: txs.map((tt) => ({
          ...tt,
          status: 'TRANSACTION_RECEIVED',
        })),
      },
    });
    setTx([]);
    return resp;
  };

  return (
    <CommandListContext.Provider
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
    </CommandListContext.Provider>
  );
};

export const useCommandList = () => {
  const txContext = useContext(CommandListContext);
  if (txContext == undefined) {
    throw new Error('useCommandList must be used within a CommandListProvider');
  }
  return txContext;
};
