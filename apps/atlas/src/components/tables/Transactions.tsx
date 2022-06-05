import type { Transaction } from '@starknet-react/core';
import {
  useStarknet,
  useStarknetTransactionManager,
} from '@starknet-react/core';

interface TxCartItem {
  transaction: Transaction;
}

const STYLES = {
  status: {
    REJECTED: 'bg-red-200',
    NOT_RECEIVED: 'bg-red-200',
    RECEIVED: 'bg-green-400/90 animate-pulse',
    PENDING: 'bg-orange-400 animate-pulse',
    ACCEPTED_ON_L2: 'bg-green-600/90',
    ACCEPTED_ON_L1: 'bg-green-900',
  },
} as const;

const TxCartItem = (props: TxCartItem) => {
  return (
    <div
      className={`${
        STYLES.status[props.transaction.status]
      }  rounded shadow-inner flex p-4 w-full font-semibold`}
    >
      <span className="w-full p-2 rounded shadow-inner bg-black/10">
        {props.transaction.status}
      </span>
      {/* <span>{props.transaction.lastUpdatedAt}</span> */}
      {/* <span>{props.transaction.transactionHash}</span> */}
    </div>
  );
};

export const TransactionCartTable = () => {
  const { transactions } = useStarknetTransactionManager();
  console.log(transactions);
  return (
    <div className="flex flex-wrap w-full space-y-2">
      {transactions.reverse().map((a, index) => {
        return <TxCartItem key={index} transaction={a} />;
      })}
    </div>
  );
};
