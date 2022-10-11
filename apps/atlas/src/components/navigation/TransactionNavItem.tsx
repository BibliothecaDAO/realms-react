import { Button } from '@bibliotheca-dao/ui-lib';
import { useTransactionManager, useTransactions } from '@starknet-react/core';
import { useCommandList } from '@/context/CommandListContext';
import { Scroll } from '@/shared/Icons';

const TransactionNavItem = ({ onClick }: { onClick: () => void }) => {
  const { hashes } = useTransactionManager();
  const txQueue = useCommandList();
  const transactions = useTransactions({ hashes });

  const TxStyle = () => {
    return transactions[0]?.loading
      ? 'bg-orange-400 animate-ping'
      : 'border-gray-200 border';
  };

  return (
    <span>
      <Button
        variant="outline"
        className="relative flex flex-col sm:flex-row sm:inline-flex"
        onClick={onClick}
      >
        <Scroll className="inline-block w-6 fill-white" />
        {txQueue.transactions.length > 0 ? (
          <div className="absolute flex items-center justify-center h-5 text-xs text-center border rounded-full bg-white/40 border-cta-100 -left-2 -top-2">
            <span className="p-1 text-center">
              {txQueue.transactions.length}
            </span>
          </div>
        ) : (
          ' '
        )}
        <span className="flex w-3 h-3 mt-3 sm:ml-1 sm:mt-0">
          <span
            className={`absolute inline-flex w-3 h-3 duration-300 rounded-full opacity-75 ${TxStyle()}`}
          ></span>

          <span
            className={`relative inline-flex w-3 h-3 rounded-full ${TxStyle()}`}
          ></span>
        </span>
      </Button>
    </span>
  );
};

export default TransactionNavItem;
