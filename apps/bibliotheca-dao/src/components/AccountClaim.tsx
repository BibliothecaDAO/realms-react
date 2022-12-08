import { Button } from '@bibliotheca-dao/ui-lib';
import { ethers, BigNumber } from 'ethers';
import React, { useEffect, useState } from 'react';
import {
  useAccount,
  useContractRead,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi';
import Web3Utils, { toBN } from 'web3-utils';
import { paymentPoolAbi } from '@/abi/PaymentPool';
import UserClaim from '@/data/claim.json';
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
const contractAddress =
  process.env.NEXT_PUBLIC_POOL_ADDRESS ||
  '0x55A69A21C44B1922D3F96B961AE567C789c4399e';

export const AccountClaim = () => {
  const [claiming, setClaiming] = useState(false);
  const [formattedClaim, setFormattedClaim] = useState([
    { payee: '', amount: toBN(0) },
  ]);
  const [week, setWeek] = useState(0);
  const [claimAmount, setClaimAmount] = useState('0');
  const [currentClaimable, setCurrentClaimable] = useState(0);
  const { address, connector, isConnected } = useAccount();

  const [withdrawnAmount, setWithdrawnAmount] = useState('0');

  const totalClaimable = UserClaim.find(
    (a) => a.payee === address?.toLowerCase()
  )?.amount;

  /* const paymentPool = new ethers.Contract(
    contractAddress,
    PaymentPool.abi,
    signer
  ); */
  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: paymentPoolAbi,
    functionName: 'withdrawals',
    args: address && [address],
    onSuccess(data) {
      setWithdrawnAmount(ethers.utils.formatEther(data));
    },
    enabled: !!address,
  });

  const getUserData = async () => {
    if (address) {
      const cycles = 11; /* hardcode past week 10 now */
      setWeek(cycles - 1);

      const formatClaim = UserClaim.map((a: any) => {
        const pre = a.amount * ((cycles - 1) / 10);
        const toEth = Web3Utils.toWei(pre.toString());

        return {
          payee: a.payee,
          amount: Web3Utils.toBN(toEth),
        };
      });
      setFormattedClaim(formatClaim);
      const fetchBalances: any = formatClaim.find(
        (a) => a.payee === address.toLowerCase()
      )?.amount;

      const toEth = ethers.utils.formatEther(fetchBalances.toString() || 0);

      try {
        const claimable =
          parseFloat(toEth) - parseFloat(ethers.utils.formatEther(data || 0));
        setCurrentClaimable(claimable);
        setClaimAmount(claimable.toString());
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    getUserData();
  }, [address]);

  /* const paymentPool = new ethers.Contract(
      contractAddress,
      PaymentPool.abi,
      signer
    ); */

  const paymentTree = new CumulativePaymentTree(formattedClaim);

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: paymentPoolAbi,
    functionName: 'withdraw',
    args: [
      BigNumber.from(Web3Utils.toWei(claimAmount)),
      paymentTree.hexProofForPayee(address?.toLowerCase(), week) as any,
    ],
  });

  const { write } = useContractWrite({
    ...config,
    onMutate() {
      setClaiming(true);
    },
    onSuccess(data) {
      getUserData();
    },
    onSettled(data, error) {
      setClaiming(false);
    },
  });
  return (
    <div>
      <div className="flex flex-wrap">
        <div className="mb-4 md:w-1/2">
          <h4>10 Week Total</h4>
          <h2>{totalClaimable && totalClaimable.toLocaleString()}</h2>
        </div>

        <div className="mb-4 md:w-1/2">
          <h4>Amount Claimed</h4>
          <h2>{parseFloat(withdrawnAmount).toLocaleString()} </h2>
        </div>
        <div className="mb-4 md:w-1/2">
          <h4>Claimable Amount</h4>
          <h2>{currentClaimable.toLocaleString()} </h2>
        </div>
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
            disabled={!write}
            onClick={() => write?.()}
            loading={claiming}
            size="sm"
            /* variant="dao" */
            texture={false}
          >
            Claim
          </Button>
          <div></div>
        </div>
      </div>
    </div>
  );
};
