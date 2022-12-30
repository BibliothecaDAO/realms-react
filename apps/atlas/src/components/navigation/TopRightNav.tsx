/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import TopRightFrame from '@bibliotheca-dao/ui-lib/icons/frame/top-right_no-ink.svg';
import { useAccount } from '@starknet-react/core';
import { useState } from 'react';
import { useUIContext } from '@/context/UIContext';
import TransactionNavItem from './TransactionNavItem';

export const TopRightNav = () => {
  const { address } = useAccount();
  const { toggleTransactionCart } = useUIContext();

  return (
    <div className="absolute top-0 right-0 z-50">
      <div className="relative">
        {address && <TransactionNavItem onClick={toggleTransactionCart} />}
        <div className="absolute top-0 right-0 w-[calc(100vw-28rem)] h-[2.8px] bg-gray-900  mr-72 pointer-events-none"></div>
        <div className="absolute top-1 right-0 w-[calc(100vw-36rem)] h-[2.2px] bg-gray-900 mr-72 pointer-events-none"></div>
        <TopRightFrame className="absolute top-0 right-0 pointer-events-none w-72 fill-gray-900" />
      </div>
    </div>
  );
};
