/* eslint-disable @typescript-eslint/no-empty-function */
import {
  useContract,
  useStarknet,
  useStarknetCall,
} from '@starknet-react/core';
import type BN from 'bn.js';
import { BigNumber, ethers } from 'ethers';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toBN } from 'starknet/dist/utils/number';
import { bnToUint256, uint256ToBN } from 'starknet/dist/utils/uint256';
import { useGetExchangeRatesQuery } from '@/generated/graphql';
import { useResources1155Contract } from '@/hooks/settling/stark-contracts';
import { resources } from '@/util/resources';

export type Resource = {
  resourceId: number;
  resourceName: string;
  amount: string;
  rate: string;
  percentChange: number;
};

type ResourcesBalance = Array<Resource>;

const resourceMapping = resources.map((resource) => {
  return bnToUint256(toBN(resource.id));
});

const initBalance = resources.map((resource) => {
  return {
    resourceId: resource.id,
    resourceName: resource.trait,
    amount: '0',
    rate: '0',
    percentChange: 0,
  };
});

const ResourcesContext = createContext<{
  balance: ResourcesBalance;
  updateBalance: () => void;
  getResourceById: (resourceId: number) => Resource | undefined;
}>(null!);

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
  const [balance, setBalance] = useState([...initBalance]);

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
        const rate = rates.find((rate) => rate.tokenId === resourceId);
        const rateAmount = rate?.amount ?? '0';
        const resourceName = rate?.tokenName ?? '';
        return {
          resourceId,
          resourceName,
          amount: uint256ToBN(resourceBalance).toString(10),
          rate: rateAmount ?? '0',
          percentChange: rate?.percentChange24Hr ?? 0,
        };
      })
    );
  }, [resourceBalanceData, exchangeRateData]);

  const getResourceById = useCallback(
    (resourceId: number) => {
      return balance.find((resource) => resource.resourceId === resourceId);
    },
    [balance]
  );

  return {
    balance,
    updateBalance,
    getResourceById,
  };
}

export function useResourcesContext() {
  return useContext(ResourcesContext);
}
