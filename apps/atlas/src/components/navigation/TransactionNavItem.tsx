import { Button } from '@bibliotheca-dao/ui-lib';
import BiblioIcon from '@bibliotheca-dao/ui-lib/icons/biblio-icon.svg';
import {
  useTransactionManager,
  useTransactions,
  useTransactionReceipt,
} from '@starknet-react/core';
import { useState } from 'react';
import { useCommandList } from '@/context/CommandListContext';

type ButtonStatus =
  | 'loading'
  | 'received'
  | 'pending'
  | 'error'
  | 'complete'
  | null;

const TransactionNavItem = ({ onClick }: { onClick: () => void }) => {
  const { hashes } = useTransactionManager();
  const txQueue = useCommandList();
  const transactions = useTransactions({ hashes });

  const [buttonStatus, setButtonStatus] = useState<ButtonStatus>(null);
  const TxStyle = () => {
    return transactions[0]?.loading ? 'bg-orange-400 animate-ping' : '';
  };

  const TxStyle1 = () => {
    switch (buttonStatus) {
      case 'complete':
        return 'stroke-emerald-800';
      case 'error':
        return 'stroke-red-400';
      case 'pending':
        return 'stroke-orange-400 background-animate animate-pulse';
      case 'received':
        return 'stroke-emerald-400 background-animate animate-pulse';
      case 'loading':
        return 'stroke-orange-800';
      default:
        return 'stroke-gray-1000';
    }
  };
  const onReceived = () => {
    setButtonStatus('received');
  };
  const onNotReceived = () => {
    setButtonStatus('pending');
  };
  const onPending = () => {
    setButtonStatus('pending');
  };
  const onAcceptedOnL2 = () => {
    setButtonStatus('complete');
  };
  const onRejected = () => {
    setButtonStatus('error');
  };
  const { data, loading, error } = useTransactionReceipt({
    hash: hashes[hashes.length - 1],
    onAcceptedOnL2,
    onNotReceived,
    onPending,
    onReceived,
    onRejected,
    watch: true,
  });

  /* useEffect(() => {
     if (
      transactions.filter((a: any) => a?.data?.status === 'RECEIVED').length
    ) {
      setButtonStatus('received');
    } else if (
      ['ACCEPTED_ON_L2', 'ACCEPTED_ON_L1'].includes(
        (transactions[0] as any)?.data?.status
      )
    ) {
      setButtonStatus('complete');
    }
  }, [transactions]); */

  const onButtonClick = () => {
    if (buttonStatus && ['complete', 'error'].includes(buttonStatus)) {
      setButtonStatus(null);
    }
    onClick();
  };

  return (
    <Button
      variant="unstyled"
      className={` md:w-32 md:h-32 lg:w-48 lg:h-48   md:-ml-16 md:-mt-16 lg:-ml-24 lg:-mt-24 top-0  ${TxStyle1()} absolute flex flex-col sm:flex-row sm:inline-flex z-100`}
      onClick={onButtonClick}
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
          className={`inline-block w-6 lg:w-9 hover:fill-yellow-500 ${TxStyle1()}`}
        />
      </div>
    </Button>
  );
};

export default TransactionNavItem;
