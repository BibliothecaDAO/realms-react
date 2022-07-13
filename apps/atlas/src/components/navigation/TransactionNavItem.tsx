import { Button } from '@bibliotheca-dao/ui-lib';
import { useStarknetTransactionManager } from '@starknet-react/core';
import { useTransactionQueue } from '@/context/TransactionQueueContext';
import { useAtlasContext } from '@/hooks/useAtlasContext';
import { Scroll } from '@/shared/Icons';
import { TxStyles } from '@/shared/Validators/styles';

const TransactionNavItem = () => {
  const { toggleMenuType } = useAtlasContext();
  const { transactions } = useStarknetTransactionManager();
  const txQueue = useTransactionQueue();

  const TxStyle = () => {
    return transactions.length
      ? TxStyles.status[transactions[0].status]
      : 'border-gray-200 border';
  };

  return (
    <span>
      <Button
        variant="primary"
        className="relative inline-flex"
        onClick={() => toggleMenuType('transactionCart')}
      >
        <Scroll className="inline-block w-6 mr-1 fill-white" />
        {txQueue.transactions.length > 0 ? (
          <div className="absolute flex items-center justify-center h-4 px-1 text-xs text-center bg-gray-800 rounded-full -left-1 -top-1">
            <span className="text-center">{txQueue.transactions.length}</span>
          </div>
        ) : (
          ' '
        )}
        <span className="flex w-3 h-3 ml-1">
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
