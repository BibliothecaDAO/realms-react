import { Button } from '@bibliotheca-dao/ui-lib';
import { useTransactionManager, useTransactions } from '@starknet-react/core';
import { useCommandList } from '@/context/CommandListContext';
import { Scroll } from '@/shared/Icons';

const TransactionNavItem = ({ onClick }: { onClick: () => void }) => {
  const { hashes } = useTransactionManager();
  const txQueue = useCommandList();
  const transactions = useTransactions({ hashes });

  const TxStyle = () => {
    return transactions[0]?.loading ? 'bg-orange-400 animate-ping' : '';
  };

  const TxStyle1 = () => {
    return transactions.filter((a: any) => a?.data?.status === 'RECEIVED')
      .length
      ? 'bg-orange-900 animate-pulse'
      : 'bg-black';
  };

  return (
    <Button
      variant="unstyled"
      className={`rounded-r-full rounded-b-full md:w-32 md:h-32 lg:w-48 lg:h-48 shadow-2xl border-yellow-800 z-40 border md:-ml-16 md:-mt-16 lg:-ml-32 lg:-mt-24 top-0  ${TxStyle1()} absolute flex flex-col sm:flex-row sm:inline-flex`}
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 md:top-[4.75rem] md:right-[3.2rem] lg:top-28 lg:right-28 z-50">
        <Scroll className="inline-block w-6 lg:w-9 fill-white" />

        <span className="flex w-3 h-3 mt-3 sm:ml-1 sm:mt-0">
          {txQueue.transactions.length > 0 ? (
            <span className="p-1 -mt-3 text-center">
              {txQueue.transactions.length}
            </span>
          ) : (
            ' '
          )}
          <span
            className={`absolute inline-flex w-3 h-3 duration-300 rounded-full opacity-75 ${TxStyle()}`}
          ></span>

          <span
            className={`relative inline-flex w-3 h-3 rounded-full ${TxStyle()}`}
          ></span>
        </span>
      </div>
    </Button>
  );
};

export default TransactionNavItem;
