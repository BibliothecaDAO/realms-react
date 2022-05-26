/* eslint-disable @typescript-eslint/no-empty-function */
import { useStarknet, useStarknetCall } from '@starknet-react/core';
import type BN from 'bn.js';
import { ethers } from 'ethers';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import { useGetExchangeRatesQuery } from '@/generated/graphql';
import { useResources1155Contract } from '@/hooks/settling/stark-contracts';
import { resources } from '@/util/resources';

type ResourcesBalance = Array<{
  resourceId: number;
  amount: string;
  rate: string;
}>;

const resourceMapping = resources.map((resource) => {
  return bnToUint256(toBN(resource.id));
});

const initBalance = resources.map((resource) => {
  return { resourceId: resource.id, amount: '0', rate: '0' };
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
  const [balance, setBalance] = useState([...defaultResourceContext.balance]);
  const { contract: resources1155Contract } = useResources1155Contract();
  const ownerAddressInt = toBN(account as string).toString();

  const { data: resourceBalanceData, refresh: updateBalance } = useStarknetCall(
    {
      contract: resources1155Contract,
      method: 'balanceOfBatch',
      args: [
        Array(resourceMapping.length).fill(ownerAddressInt), // ...again
        resourceMapping,
        // Token IDs],
      ],
    }
  );

  const { data: exchangeRateData } = useGetExchangeRatesQuery({
    pollInterval: 5000,
  });

  useEffect(() => {
    if (!resourceBalanceData || !resourceBalanceData[0]) {
      return;
    }
    const rates = exchangeRateData?.getExchangeRates ?? [];
    setBalance(
      resourceBalanceData[0].map((resourceBalance, index) => {
        const resourceId = index + 1;
        const rateAmount = rates.find(
          (rate) => rate.tokenId === resourceId
        )?.amount;
        return {
          resourceId,
          amount: uint256ToBN(resourceBalance).toString(10),
          rate: rateAmount ?? '0',
        };
      })
    );
  }, [resourceBalanceData, exchangeRateData]);

  return {
    balance,
    updateBalance,
  };
}

export function useResourcesContext() {
  return useContext(ResourcesContext);
}
