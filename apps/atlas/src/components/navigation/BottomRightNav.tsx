/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import BottomRightFrame from '@bibliotheca-dao/ui-lib/icons/frame/bottom-right_no-ink.svg';
import { useAccount } from '@starknet-react/core';
import { useState } from 'react';
import { TransactionCartSideBar } from '@/components/ui/transactions/TransactionCartSideBar';
import { useUIContext } from '@/context/UIContext';
import TransactionNavItem from './TransactionNavItem';

export const BottomRightNav = () => {
  const { address } = useAccount();
  const { transactionCart, toggleTransactionCart } = useUIContext();

  return (
    <div className="absolute bottom-0 right-0 z-50">
      <div className="relative">
        <BottomRightFrame className="absolute bottom-0 right-0 pointer-events-none w-72" />
        {/* {address && <TransactionNavItem onClick={toggleTransactionCart} />} */}
      </div>

      <div className="absolute bottom-1 w-[calc(100vw-28rem)] h-[2.7px] bg-black pointer-events-none"></div>
      <div className="absolute bottom-1 right-0 w-[calc(100vw-36rem)] h-[2.2px] bg-black mr-72 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[calc(100vw-28rem)] h-[2px] bg-black mr-64 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[6px] h-[calc(100vh-28rem)] bg-black mb-64 pointer-events-none"></div>
      <div className="absolute bottom-5 right-2 w-[2px] h-[calc(100vh-28rem)] bg-black  mb-64 pointer-events-none"></div>
      <TransactionCartSideBar
        isOpen={transactionCart}
        onClose={toggleTransactionCart}
      />
    </div>
  );
};
