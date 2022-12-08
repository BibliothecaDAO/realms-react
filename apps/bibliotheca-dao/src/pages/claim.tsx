/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */

import React, { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { AccountClaim } from '@/components/AccountClaim';
import { MainLayout } from '@/components/layout/MainLayout';

function Claim() {
  const { connector, isConnected } = useAccount();

  /* try {
      const withdraw = await paymentPool.withdraw(formatAmount, proof);
      const receipt = await withdraw.wait();
      getUserData();
    } catch (e) {
      console.log(e);
    } */

  return (
    <MainLayout>
      <div className="container px-10 py-20 pt-40 mx-auto sm:px-20 sm:py-40 sm:pt-60">
        <h1 className="mb-8">Claim $LORDS Airdrop</h1>
        {isConnected && <AccountClaim />}
      </div>
    </MainLayout>
  );
}

export default Claim;
