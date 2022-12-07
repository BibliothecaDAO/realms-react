import { Button } from '@bibliotheca-dao/ui-lib';
import BiblioIcon from '@bibliotheca-dao/ui-lib/icons/biblio-icon.svg';
import { useTransactionManager, useTransactions } from '@starknet-react/core';

import { useCommandList } from '@/context/CommandListContext';

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
      ? 'stroke-orange-900 animate-pulse'
      : '';
  };

  return (
    <Button
      variant="unstyled"
      className={`md:w-32 md:h-32 lg:w-48 lg:h-48 md:-ml-16 md:-mt-16 lg:-ml-24 lg:-mt-24 top-0   absolute flex flex-col sm:flex-row sm:inline-flex `}
      onClick={onClick}
    >
      <div className="absolute md:top-[4.75rem] md:right-[3.2rem] lg:top-32 lg:right-32 flex pointer-events-none">
        <span className="flex w-3 h-3 mt-3 mr-1 sm:ml-1 sm:mt-0">
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
        <BiblioIcon
          className={`inline-block w-6 lg:w-9 fill-green-800 hover:fill-yellow-500 ${TxStyle1()}`}
        />
      </div>
    </Button>
  );
};

export default TransactionNavItem;
