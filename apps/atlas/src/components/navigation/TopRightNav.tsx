/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Button } from '@bibliotheca-dao/ui-lib';
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

  return (
    <div className="absolute z-50 right-0 top-0">
      <div className="relative">
        {address && <TransactionNavItem onClick={onTransactionNavClick} />}
      </div>
      <TransactionCartSideBar
        isOpen={selectedSideBar === 'transaction'}
        onClose={onTransactionNavClick}
      />
    </div>
  );
};
