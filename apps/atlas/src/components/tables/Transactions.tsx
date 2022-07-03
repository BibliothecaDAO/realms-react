import type { Transaction } from '@starknet-react/core';
import {
  useStarknet,
  useStarknetTransactionManager,
} from '@starknet-react/core';
import Link from 'next/link';
import type { Status, TransactionStatus } from 'starknet';
import { getTxMessage } from '@/hooks/settling/useTxMessage';
import { ExternalLink } from '@/shared/Icons';

interface Metadata {
  description: string;
  title: string;
  action: string;
}
interface EnqueuedOrReceivedTransaction {
  metadata?: Metadata;
  status: Status | TransactionStatus | 'ENQUEUED';
  transactionHash?: string;
}
interface TxCartItem {
  transaction: EnqueuedOrReceivedTransaction;
}

const STYLES = {
  status: {
    REJECTED: 'bg-red-400',
    NOT_RECEIVED: 'bg-red-200',
    RECEIVED: 'bg-green-400/90 animate-pulse',
    PENDING: 'bg-orange-400 animate-pulse',
    ACCEPTED_ON_L2: 'bg-green-600/90',
    ACCEPTED_ON_L1: 'bg-green-900',
    TRANSACTION_RECEIVED: 'bg-green-400 animate-pulse',
    ENQUEUED: 'border-gray-600 border border-dashed',
  },
} as const;

export const TxCartItem = (props: TxCartItem) => {
  const { title, description } = getTxMessage(props.transaction);

  const resolvedTitle = props.transaction.metadata?.title || title;
  const resolvedMsg = props.transaction.metadata?.description || description;

  return (
    <div
      className={`${
        STYLES.status[props.transaction.status]
      }  rounded shadow-inner flex p-4 w-full font-semibold`}
    >
      <div className="flex justify-between w-full p-2 rounded shadow-inner bg-black/10">
        <div>
          <h4>{resolvedTitle}</h4>
          {Array.isArray(resolvedMsg) ? (
            resolvedMsg.map((m, i) => {
              if (m.title && m.description) {
                // The description is typically unique for a tx
                return (
                  <div key={`${props.transaction.transactionHash}:${i}`}>
                    <h4>{m.title}</h4>
                    <p>{m.description}</p>
                  </div>
                );
              }
              return <p key={m}>{m}</p>;
            })
          ) : (
            <p>{resolvedMsg}</p>
          )}
        </div>
        {props.transaction.transactionHash ? (
          <Link
            target={'_blank'}
            rel="noreferrer noopener"
            href={
              // TODO: use network aware link using @/util/blockExplorer
              'https://goerli.voyager.online/tx/' +
              props.transaction.transactionHash
            }
          >
            <span>
              See on Voyager <ExternalLink className="inline-block w-4" />
            </span>
          </Link>
        ) : null}
      </div>
      {/* <span>{props.transaction.lastUpdatedAt}</span> */}
    </div>
  );
};

export const TransactionCartTable = () => {
  const { transactions } = useStarknetTransactionManager();
  return (
    <div className="flex flex-wrap w-full space-y-2">
      {transactions.reverse().map((a, index) => {
        return <TxCartItem key={index} transaction={a} />;
      })}
    </div>
  );
};
