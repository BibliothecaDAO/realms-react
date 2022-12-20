import { Button } from '@bibliotheca-dao/ui-lib/base';
import type { ManagedTransaction } from '@starknet-react/core';
import {
  useTransactionManager,
  useTransactions,
  useTransactionReceipt,
} from '@starknet-react/core';
import type { ReactElement } from 'react';
import { useState, useEffect, useRef } from 'react';
import type { Status, TransactionStatus } from 'starknet';
import { twMerge } from 'tailwind-merge';
import { ExternalLink } from '@/components/ui/Icons';
import type { ENQUEUED_STATUS } from '@/constants/index';
import { getTxRenderConfig } from '@/hooks/settling/useTxMessage';
import { storage } from '@/util/localStorage';

export interface Metadata {
  description: string;
  title: string;
  action: string;
  multicalls?: any;
}

interface TxCartItem {
  index: number;
  transaction: ManagedTransaction<Metadata>;
  status?: Status | TransactionStatus | typeof ENQUEUED_STATUS;
}

const STYLES = {
  status: {
    REJECTED: 'bg-red-400/20',
    NOT_RECEIVED: 'bg-red-200/20',
    RECEIVED: 'bg-green-800/40 animate-pulse',
    PENDING: 'bg-orange-500/20 animate-pulse',
    ACCEPTED_ON_L2: 'bg-green-800/20',
    ACCEPTED_ON_L1: 'bg-green-900/20',
    TRANSACTION_RECEIVED: 'bg-green-700 animate-pulse',
    ENQUEUED: '  bg-gray-1000/80',
  },
} as const;

const FORMATED_STATUS = {
  status: {
    REJECTED: 'Rejected',
    NOT_RECEIVED: 'No received',
    RECEIVED: 'Received',
    PENDING: 'Pending',
    ACCEPTED_ON_L2: 'Accepted on StarkNet',
    ACCEPTED_ON_L1: 'Accepted on MainNet',
    TRANSACTION_RECEIVED: 'Transaction Received',
    ENQUEUED: 'ENQUEUED',
  },
} as const;

export const TxCartItem = (props: TxCartItem) => {
  // Multicall descriptions are generated by the TransactionQueueContext
  // as array of objects that describe how to render sub-calls.
  const ref = useRef<any>(null);
  const { data, loading, error } = useTransactionReceipt({
    hash: props.transaction.hash,
    watch: true,
  });

  const multicalls = props.transaction.metadata?.multicalls;
  let title: string;
  let description: string | ReactElement;
  if (multicalls) {
    title = 'Actions';
    description = '';
  } else {
    const { title: configTitle, description: configDescription } =
      getTxRenderConfig(props.transaction);
    title = props.transaction.metadata?.title || configTitle;
    description = (
      <span>
        {props.transaction.metadata?.description || configDescription}
      </span>
    );
  }

  return (
    <div
      ref={ref}
      className={twMerge(
        STYLES.status[data?.status || 0],
        `rounded-xl flex p-4 w-full mb-2`
      )}
    >
      <div className="flex flex-wrap w-full p-1 rounded bg-gray-1000/19">
        <div className="flex justify-between w-full pb-2 mb-2 border-b border-white/20">
          <h5 className="self-center">
            {FORMATED_STATUS.status[data?.status || 0]}
          </h5>
          <div className="self-center ">
            {props.transaction.hash ? (
              <Button
                target={'_blank'}
                size="xs"
                variant="outline"
                rel="noreferrer noopener"
                href={
                  // TODO: use network aware link using @/util/blockExplorer
                  'https://testnet.starkscan.co/tx/' + props.transaction.hash
                }
              >
                See on StarkScan <ExternalLink className="inline-block w-4" />
              </Button>
            ) : null}
          </div>
        </div>

        <div>
          <h3>{title}</h3>
          {multicalls ? (
            multicalls.map((tx, i) => {
              const renderConfig = getTxRenderConfig(tx);
              if (renderConfig) {
                return (
                  <div className="py-2" key={`${props.transaction.hash}:${i}`}>
                    <h5 className="uppercase">{renderConfig.title}</h5>
                    <p className="text-lg text-gray-400">
                      {renderConfig.description}
                    </p>
                  </div>
                );
              }
              return <p key={i}>{'Transaction'}</p>;
            })
          ) : (
            <p>{description}</p>
          )}
        </div>
      </div>
      {/* <span>{props.transaction.lastUpdatedAt}</span> */}
    </div>
  );
};

const TX_HISTORY_STORAGE_KEY = 'txHistory';

const TX_HISTORY_LENGTH = 50;

export const TransactionCartTable = () => {
  const { hashes, transactions } = useTransactionManager<Metadata>();
  const transactionStatus = useTransactions({ hashes });
  const [txHistory, setTxHistory] = useState<any>([]);
  const historyStorage = storage<any>(TX_HISTORY_STORAGE_KEY, []);

  useEffect(() => {
    const storageTransactions = historyStorage.get();
    const lastTx = transactions.pop();
    if (lastTx) {
      storageTransactions.push(lastTx);
      historyStorage.set(storageTransactions);
    }
    if (storageTransactions.length > TX_HISTORY_LENGTH) {
      storageTransactions.shift();
    }
    setTxHistory(storageTransactions);
  }, [transactions]);

  return (
    <div className="flex flex-col-reverse flex-wrap w-full">
      {txHistory.map((a, index) => {
        return <TxCartItem index={index} key={index} transaction={a} />;
      })}
    </div>
  );
};
