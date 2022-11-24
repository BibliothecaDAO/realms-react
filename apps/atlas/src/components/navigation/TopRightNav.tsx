/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useAccount } from '@starknet-react/core';
import { useState } from 'react';
import { useUIContext } from '@/context/UIContext';
import { TransactionCartSideBar } from '../sidebars/TransactionCartSideBar';
import TransactionNavItem from './TransactionNavItem';

type HeaderSidePanelType = 'bank' | 'transaction' | '';

export const TopRightNav = () => {
  const { address } = useAccount();
  const { transactionCart, toggleTransactionCart } = useUIContext();

  return (
    <div className="absolute z-50 right-0 top-0">
      <div className="relative">
        {address && <TransactionNavItem onClick={toggleTransactionCart} />}
      </div>
      <TransactionCartSideBar
        isOpen={transactionCart}
        onClose={toggleTransactionCart}
      />
    </div>
  );
};
