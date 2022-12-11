/* eslint-disable @typescript-eslint/no-empty-function */
import { useAccount, useStarknetCall } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { uint256ToBN } from 'starknet/dist/utils/uint256';
import {
  getTxResourcesTrades,
  getTxCosts,
} from '@/components/bank/MarketGetters';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import { resources } from '@/constants/resources';
import { useGetWalletBalancesQuery } from '@/generated/graphql';
import { useLordsContract } from '@/hooks/settling/stark-contracts';
import type { NetworkState } from '@/types/index';
import { LORDS_TOKEN_TOKENID } from '../constants';
import { useCommandList } from './CommandListContext';

export type Resource = {
  resourceId: number;
  resourceName: string;
  amount: string;
  checkoutAmount: string;
};

type ResourcesBalance = Array<Resource>;

const initBalance = resources.map((resource) => {
  return {
    resourceId: resource.id,
    resourceName: resource.trait,
    amount: '0',
    checkoutAmount: '0',
  };
});

const UserBalancesContext = createContext<{
  balance: ResourcesBalance;
  balanceStatus: NetworkState;
  lordsBalance: string;
  updateBalance: () => void;
  getBalanceById: (resourceId: number) => Resource | undefined;
}>(null!);

interface UserBalancesProviderProps {
  children: React.ReactNode;
}

export const UserBalancesProvider = (props: UserBalancesProviderProps) => {
  return (
    <UserBalancesContext.Provider value={useUserBalances()}>
      {props.children}
    </UserBalancesContext.Provider>
  );
};

function useUserBalances() {
  const txQueue = useCommandList();
  // const { hashes, transactions } = useTransactionManager<Metadata>();

  const { address } = useAccount();
  const [balance, setBalance] = useState([...initBalance]);
  const [balanceStatus, setBalanceStatus] = useState<NetworkState>('loading');
  const [lordsBalance, setLordsBalance] = useState('0');

  const { data: walletBalancesData, refetch: updateBalance } =
    useGetWalletBalancesQuery({
      variables: {
        address: address ? getAccountHex(address)?.toLowerCase() : '',
      },
      pollInterval: 5000,
    });

  useMemo(() => {
    if (!walletBalancesData || !walletBalancesData.walletBalances) {
      return;
    }

    /* setAvailableResourceIds(
      resources
        .map((resource) => resource.id)
        .filter(
          (resourceId) =>
            selectedSwapResources.find(
              (resource) => resource.resourceId === resourceId
            ) === undefined
        )
    ); */

    setLordsBalance(
      BigNumber.from(
        walletBalancesData.walletBalances.find(
          (a) => a.tokenId === LORDS_TOKEN_TOKENID
        )?.amount ?? 0
      ).toString()
    );

    const allResourceCosts = getTxCosts(txQueue)
      .map((t) => t.resources)
      .flat(1);

    const costsByResourceId = {};

    allResourceCosts.forEach((c) => {
      costsByResourceId[c.resourceId] = {
        ...costsByResourceId[c.resourceId],
        resourceId: c.resourceId,
        amount: (costsByResourceId[c.resourceId]?.amount ?? 0) + c.amount,
      };
    });

    const allResourcesTrades = getTxResourcesTrades(txQueue);

    const tradeChangeByResourceId = {};

    allResourcesTrades.forEach((t) => {
      t.forEach((c) => {
        tradeChangeByResourceId[c.resourceId] = {
          ...tradeChangeByResourceId[c.resourceId],
          resourceId: c.resourceId,
          amount:
            c.action === 'buy_tokens'
              ? (
                  tradeChangeByResourceId[c.resourceId]?.amount ??
                  BigNumber.from(0)
                ).add(c.amount)
              : (
                  tradeChangeByResourceId[c.resourceId]?.amount ??
                  BigNumber.from(0)
                ).sub(c.amount),
        };
      });
    });

    setBalance(
      resources.map((resource, index) => {
        const resourceId = resource.id ?? 0;
        const resourceName = resource.trait ?? 0;

        const inCartCost = costsByResourceId[resourceId]
          ? BigNumber.from(
              parseInt(costsByResourceId[resourceId]?.amount).toString()
            )
          : 0;

        const inCartTradeChange =
          tradeChangeByResourceId[resourceId]?.amount ?? 0;

        const baseBn = BigNumber.from('1000000000000000000').mul(inCartCost);

        const walletBalance =
          walletBalancesData.walletBalances.find(
            (a) => a.tokenId === resourceId
          )?.amount ?? 0;

        const checkoutBalance =
          BigNumber.from(walletBalance).add(inCartTradeChange);

        const actualBalance = checkoutBalance.gt(baseBn)
          ? checkoutBalance.sub(baseBn)
          : 0;

        return {
          resourceId,
          resourceName,
          amount: actualBalance.toString(),
          checkoutAmount: checkoutBalance.toString(),
        };
      })
    );
  }, [walletBalancesData, txQueue]);

  const getBalanceById = useCallback(
    (resourceId: number) => {
      return balance.find((resource) => resource.resourceId === resourceId);
    },
    [balance]
  );

  return {
    balance,
    balanceStatus,
    updateBalance,
    getBalanceById,
    lordsBalance,
  };
}

export function useUserBalancesContext() {
  return useContext(UserBalancesContext);
}
