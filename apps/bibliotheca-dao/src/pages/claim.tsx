/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { Button } from '@bibliotheca-dao/ui-lib/base';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Web3Utils, { toBN } from 'web3-utils';
import PaymentPool from '@/abi/PaymentPool.json';
import { MainLayout } from '@/components/layout/MainLayout';
import UserClaim from '@/data/claim.json';
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

  const week = 1;

  const amountPerWeekCalc = (amount: any) => {
    const pre = amount * (week / 10);

    const toEth = Web3Utils.toWei(pre.toString());

    return Web3Utils.toBN(toEth);
  };

  const formattedClaim = UserClaim.map((a: any) => {
    return {
      payee: a.payee,
      amount: amountPerWeekCalc(a.amount),
    };
  });

  useEffect(() => {
    const fetchBalances: any =
      formattedClaim.find((a: any) => a.payee === account.toLowerCase()) ||
      toBN(0);

    if (fetchBalances.amount) {
      const toEth = ethers.utils.formatEther(
        fetchBalances.amount.toString() || 0
      );
      setClaimAmount(toEth);
    }
  });

  async function claim() {
    const paymentPool = new ethers.Contract(
      PaymentPool.address,
      PaymentPool.abi,
      signer
    );

    const paymentTree = new CumulativePaymentTree(formattedClaim);

    const proof = paymentTree.hexProofForPayee(account.toLowerCase(), week);

    const formatAmount = Web3Utils.toWei(claimAmount);

    console.log(proof);
    try {
      await paymentPool.withdraw(formatAmount, proof);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <MainLayout>
      <div className="container px-10 py-20 pt-40 mx-auto sm:px-20 sm:py-40 sm:pt-60">
        <h1 className="mb-8">Claim Airdrop</h1>

        <div className="mb-4">
          <h4>Your total claimable</h4>
          <h2>
            {(parseInt(claimAmount) * (10 / week)).toLocaleString()} $LORDS
          </h2>
        </div>
        <p>
          Your total claimable unlocks 10% per week. You do not need to claim
          every week.{' '}
        </p>
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
