/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { Button } from '@bibliotheca-dao/ui-lib/base';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Web3Utils from 'web3-utils';
import PaymentPool from '@/abi/PaymentPool.json';
import { MainLayout } from '@/components/layout/MainLayout';
import { useWalletContext } from '@/hooks/useWalletContext';
import CumulativePaymentTree from '@/util/cumulative-payment-tree';

const paymentList = [
  {
    payee: '',
    amount: Web3Utils.toBN('600000000000000000000000'),
  },
  {
    payee: '',
    amount: Web3Utils.toBN('600000000000000000000000'),
  },
];

function Claim() {
  const [claimAmount, setClaimAmount] = useState('200000000000000000000000');
  const { signer, account } = useWalletContext();

  async function claim() {
    const paymentPool = new ethers.Contract(
      PaymentPool.address,
      PaymentPool.abi,
      signer
    );

    const paymentTree = new CumulativePaymentTree(paymentList);

    const proof = paymentTree.hexProofForPayee(account, 3);

    console.log(proof);

    try {
      await paymentPool.withdraw(claimAmount, proof);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <MainLayout>
      <div className="container px-10 py-20 pt-40 mx-auto sm:px-20 sm:py-40 sm:pt-60">
        <h1 className="mb-8">Claim Airdrop</h1>
        <p>Enter your claim amount. You do not have to claim everyweek.</p>
        <div>
          <div className="flex flex-wrap w-72">
            <input
              className="w-full px-3 py-2 mb-4 text-sm font-bold leading-tight tracking-widest text-white uppercase transition-all duration-300 rounded shadow-md appearance-none h-9 focus:outline-none bg-gray-800/40 hover:bg-gray-300/20"
              type="text"
              value={claimAmount}
              onChange={(e) => {
                setClaimAmount(e.target.value);
              }}
              placeholder={'enter amount to claim'}
            />
            <Button
              className="w-full"
              onClick={claim}
              size="sm"
              variant="dao"
              texture={false}
            >
              Claim
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Claim;
