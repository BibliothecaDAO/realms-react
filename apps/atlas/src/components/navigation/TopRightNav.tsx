/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  useAccount,
  useTransactionManager,
  useTransactions,
} from '@starknet-react/core';
import { useState } from 'react';
import { TransactionCartSideBar } from '../sidebars/TransactionCartSideBar';
import TransactionNavItem from './TransactionNavItem';

type HeaderSidePanelType = 'bank' | 'transaction' | '';

export const TopRightNav = () => {
  const { hashes } = useTransactionManager();
  const { address } = useAccount();
  const transactions = useTransactions({ hashes });

  const [selectedSideBar, setSelectedSideBar] =
    useState<HeaderSidePanelType>('');

  function onTransactionNavClick() {
    setSelectedSideBar(selectedSideBar === 'transaction' ? '' : 'transaction');
  }
  const TxStyle = () => {
    return transactions.filter((a: any) => a?.data?.status === 'RECEIVED')
      .length
      ? 'bg-orange-900 animate-pulse'
      : 'bg-black';
  };

  return (
    <div className="absolute z-40 right-0 top-0">
      <div className="relative">
        <div
          className={`absolute rounded-r-full rounded-b-full md:w-32 md:h-32 lg:w-48 lg:h-48 shadow-2xl border-yellow-800 z-40 border md:-ml-16 md:-mt-16 lg:-ml-24 lg:-mt-24 top-0  ${TxStyle()}`}
        ></div>
        <div className="z-40 top-3 lg:top-5 right-0 lg:right-1 absolute">
          {address && <TransactionNavItem onClick={onTransactionNavClick} />}
        </div>
      </div>
      <TransactionCartSideBar
        isOpen={selectedSideBar === 'transaction'}
        onClose={onTransactionNavClick}
      />
    </div>
  );
};
