import {
  useStarknet,
  useStarknetTransactionManager,
} from '@starknet-react/core';
import Link from 'next/link';

interface Transaction {
  transactionItem: TransactionItem;
}

interface TransactionItem {
  status: string;
  transaction: TransactionData;
  transactionHash: string;
  lastUpdatedAt: number;
  metadata?: any;
}

interface TransactionData {
  calldata: string[];
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
  },
} as const;

const TxCartItem = (props: Transaction) => {
  return (
    <div
      className={`${
        STYLES.status[props.transactionItem.status]
      }  rounded shadow-inner flex p-4 w-full font-semibold`}
    >
      <span className="flex justify-between w-full p-2 uppercase rounded shadow-inner bg-black/10">
        {props.transactionItem.status}

        <Link
          target={'blank_'}
          href={
            'https://goerli.voyager.online/tx/' +
            props.transactionItem.transactionHash
          }
        >
          See on Voyager
        </Link>
      </span>
      {/* <span>{props.transaction.lastUpdatedAt}</span> */}
    </div>
  );
};

export const TransactionCartTable = () => {
  const { transactions } = useStarknetTransactionManager();
  console.log(transactions);
  return (
    <div className="flex flex-wrap w-full space-y-2">
      {transactions.reverse().map((a, index) => {
        return <TxCartItem key={index} transactionItem={a} />;
      })}
    </div>
  );
};
