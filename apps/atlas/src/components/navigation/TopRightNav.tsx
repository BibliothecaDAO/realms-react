'use client';
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  useAccount,
  useTransactionManager,
  useTransactions,
} from '@starknet-react/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAccount as useL1Account } from 'wagmi';
import NetworkConnectButton from '@/components/navigation/NetworkConnectButton';
import { useResourcesContext } from '@/context/ResourcesContext';
import { usePlayer } from '@/hooks/usePlayer';
import { ResourceSwapSideBar } from '../sidebars/ResourceSwapSideBar';
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
    return transactions.length ? 'bg-orange-900 animate-pulse' : 'bg-black';
  };
  console.log(transactions);
  return (
    <div className="absolute top-0 right-0 z-40">
      <div className="relative">
        <div
          className={`absolute rounded-r-full rounded-b-full w-48 h-48 shadow-2xl border-yellow-800 z-40 border  -ml-24 -mt-24 top-0  ${TxStyle()}`}
        ></div>
        <div className="z-40 top-5 right-1 absolute">
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
