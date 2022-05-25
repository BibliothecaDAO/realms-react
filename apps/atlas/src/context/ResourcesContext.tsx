/* eslint-disable @typescript-eslint/no-empty-function */
import { useStarknet, useStarknetCall } from '@starknet-react/core';
import type BN from 'bn.js';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import { useResources1155Contract } from '@/hooks/settling/stark-contracts';
import { shortenAddress } from '@/util/formatters';
import { resources } from '@/util/resources';

type ResourcesBalance = Array<{ resourceId: number; amount: number }>;

const resourceMapping = resources.map((resource) => {
  return bnToUint256(toBN(resource.id));
});

const initBalance = resources.map((resource) => {
  return { resourceId: resource.id, amount: 0 };
});

const defaultResourceContext = {
  balance: initBalance,
  updateBalance: () => {},
};

const ResourcesContext = createContext<{
  balance: ResourcesBalance;
  updateBalance: () => void;
}>(defaultResourceContext);

interface ResourceProviderProps {
  children: React.ReactNode;
}

export const ResourceProvider = (props: ResourceProviderProps) => {
  return (
    <ResourcesContext.Provider value={useResources()}>
      {props.children}
    </ResourcesContext.Provider>
  );
};

function useResources() {
  const { account } = useStarknet();

  const { contract: resources1155Contract } = useResources1155Contract();
  const ownerAddressInt = toBN(account as string).toString();

  const {
    data: resourceBalanceData,
    loading,
    error,
    refresh: updateBalance,
  } = useStarknetCall({
    contract: resources1155Contract,
    method: 'balanceOfBatch',
    args: [
      Array(resourceMapping.length).fill(ownerAddressInt), // ...again
      resourceMapping,
      // Token IDs],
    ],
  });
  let balance = defaultResourceContext.balance;
  if (account && resourceBalanceData && resourceBalanceData[0]) {
    balance = resourceBalanceData[0].map((resourceBalance, index) => {
      return {
        resourceId: index + 1,
        amount: uint256ToBN(resourceBalance).toString(10),
      };
    });
  }
  /* useEffect(() => {
    updateBalance();
  }, [account, updateBalance]); */

  return {
    balance,
    updateBalance,
  };
}

export function useResourcesContext() {
  return useContext(ResourcesContext);
}
