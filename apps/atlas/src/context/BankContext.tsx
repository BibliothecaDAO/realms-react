/* eslint-disable @typescript-eslint/no-empty-function */
import {
  useAccount,
  useStarknetCall,
  useTransactionManager,
} from '@starknet-react/core';
import { BigNumber } from 'ethers';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { number, uint256 } from 'starknet';
import {
  getTxCosts,
  getTxResourcesTrades,
} from '@/components/bank/MarketGetters';
import { getAccountHex } from '@/components/realms/RealmsGetters';
import type { Metadata } from '@/components/ui/transactions/Transactions';
import { resources } from '@/constants/resources';
import {
  useGetWalletBalancesQuery,
  useGetGameConstantsQuery,
} from '@/generated/graphql';
import { useMarketRate } from '@/hooks/market/useMarketRate';
import {
  useLordsContract,
  useExchangeContract,
} from '@/hooks/settling/stark-contracts';
import type { ResourceCost, NetworkState, HistoricPrices } from '@/types/index';
import { useCommandList } from './CommandListContext';

export type BankResource = {
  resourceId: number;
  resourceName: string;
  rate: string;
  lp: string;
  currencyAmount: string;
  tokenAmount: string;
  percentChange: number;
};

export type ResourceQty = {
  resourceId: number;
  qty: number;
};

export type LpQty = {
  resourceId: number;
  lpqty: number;
  currencyqty: number;
};

type ResourcesBalance = Array<BankResource>;

const resourceMapping = resources.map((resource) => {
  return uint256.bnToUint256(number.toBN(resource.id));
});

const initResources = resources.map((resource) => {
  return {
    resourceId: resource.id,
    resourceName: resource.trait,
    rate: '0',
    lp: '0',
    currencyAmount: '0',
    tokenAmount: '0',
    percentChange: 0,
  };
});

const BankContext = createContext<{
  bankResources: BankResource[];
  availableResourceIds: number[];
  selectedSwapResources: ResourceQty[];
  selectedSwapResourcesWithBalance: (BankResource & ResourceQty)[];
  addSelectedSwapResources: (resourceId?: number, qty?: number) => void;
  removeSelectedSwapResource: (resourceId: number) => void;
  removeAllSelectedSwapResources: () => void;
  updateSelectedSwapResourceQty: (resourceId: number, qty: number) => void;
  updateSelectedSwapResource: (
    resourceId: number,
    newResourceId: number
  ) => void;
  getResourceById: (resourceId: number) => BankResource | undefined;
  batchAddResources: (cost: ResourceCost[]) => void;
  historicPrices: HistoricPrices | undefined;
  isLordsApproved: boolean;
  setIsLordsApproved: (bool) => void;
  isResourcesApproved: boolean;
  setIsResourcesApproved: (bool) => void;
}>(null!);

interface BankProviderProps {
  children: React.ReactNode;
}

export const BankProvider = (props: BankProviderProps) => {
  return (
    <BankContext.Provider value={useResources()}>
      {props.children}
    </BankContext.Provider>
  );
};

function useResources() {
  // const txQueue = useCommandList();
  // const { hashes, transactions } = useTransactionManager<Metadata>();

  const { address } = useAccount();

  const [isLordsApproved, setIsLordsApproved] = useState<boolean>(false);
  const [isResourcesApproved, setIsResourcesApproved] =
    useState<boolean>(false);

  const [bankResources, setBankResources] =
    useState<BankResource[]>(initResources);

  const [availableResourceIds, setAvailableResourceIds] = useState<number[]>(
    resources.map((resource) => resource.id)
  );
  const [selectedSwapResources, setSelectedSwapResources] = useState<
    ResourceQty[]
  >([]);

  const { contract: exchangeContract } = useExchangeContract();
  const ownerAddressInt = address
    ? number.toBN(address as string).toString()
    : undefined;

  const resourceMappingArray = useMemo(() => {
    return ownerAddressInt
      ? Array(resourceMapping.length).fill(ownerAddressInt)
      : undefined;
  }, [ownerAddressInt]);

  const { data: lpBalanceData } = useStarknetCall({
    contract: exchangeContract,
    method: 'balanceOfBatch',
    args: [resourceMappingArray, resourceMapping],
  });

  const { data: exchangePairData } = useStarknetCall({
    contract: exchangeContract,
    method: 'get_all_currency_reserves',
    args: [resourceMapping],
    options: {
      watch: false,
    },
  });

  const { exchangeInfo, historicPrices } = useMarketRate();

  // batch add a cost
  const batchAddResources = (cost: ResourceCost[]) => {
    const mapped: ResourceQty[] = cost?.map((a) => {
      return {
        resourceId: a.resourceId,
        qty: a.amount * 1.1,
      };
    });

    const result: ResourceQty[] = Object.values(
      [...selectedSwapResources, ...mapped].reduce(
        (acc, { resourceId, qty }) => {
          acc[resourceId] = {
            resourceId,
            qty: (acc[resourceId] ? acc[resourceId].qty : 0) + qty,
          };
          return acc;
        },
        {}
      )
    );

    setSelectedSwapResources([...result]);
  };

  const addSelectedSwapResources = (resourceId?: number, qty?: number) => {
    if (availableResourceIds.length === 0) {
      return;
    }
    const select = resourceId ?? availableResourceIds[0];
    setSelectedSwapResources([
      { resourceId: select, qty: qty ? qty : 0 },
      ...selectedSwapResources,
    ]);
  };

  const removeSelectedSwapResource = (resourceId: number) => {
    setSelectedSwapResources(
      selectedSwapResources.filter((item) => item.resourceId !== resourceId)
    );
  };

  const removeAllSelectedSwapResources = () => {
    setSelectedSwapResources([]);
  };

  const updateSelectedSwapResource = (
    resourceId: number,
    newResourceId: number
  ) => {
    setSelectedSwapResources(
      selectedSwapResources.map((resource) => {
        if (resource.resourceId === resourceId) {
          return { ...resource, resourceId: newResourceId };
        }
        return resource;
      })
    );
  };

  const updateSelectedSwapResourceQty = (resourceId: number, qty: number) => {
    setSelectedSwapResources(
      selectedSwapResources.map((resource) =>
        resource.resourceId === resourceId
          ? { ...resource, qty: qty }
          : { ...resource }
      )
    );
  };

  useMemo(() => {
    if (!exchangePairData) {
      return;
    }

    setAvailableResourceIds(
      resources
        .map((resource) => resource.id)
        .filter(
          (resourceId) =>
            selectedSwapResources.find(
              (resource) => resource.resourceId === resourceId
            ) === undefined
        )
    );

    const rates = exchangeInfo ?? [];
    const pluckData = (data: any) => {
      return data.map((resourceBalance, index) => {
        return {
          amount: uint256.uint256ToBN(resourceBalance).toString(10),
        };
      });
    };
    const userLp = lpBalanceData ? pluckData(lpBalanceData[0]) : [];
    const currencyExchangeData = exchangePairData
      ? pluckData(exchangePairData[0])
      : [];
    const tokenExchangeData = exchangePairData
      ? pluckData(exchangePairData[1])
      : [];

    setBankResources(
      resources.map((resource, index) => {
        const resourceId = resource.id ?? 0;
        const resourceName = resource.trait ?? 0;

        const rate = rates.find((rate) => rate.tokenId === resourceId);

        return {
          resourceId,
          resourceName,
          rate: rate?.amount ?? '0',
          lp: userLp[index]?.amount ?? '0',
          currencyAmount: currencyExchangeData[index]?.amount ?? '0',
          tokenAmount: tokenExchangeData[index]?.amount ?? '0',
          percentChange: rate?.percentChange24Hr ?? 0,
        };
      })
    );
  }, [lpBalanceData, exchangePairData, exchangeInfo, selectedSwapResources]);

  const getResourceById = useCallback(
    (resourceId: number) => {
      return bankResources.find(
        (resource) => resource.resourceId === resourceId
      );
    },
    [bankResources]
  );

  const selectedSwapResourcesWithBalance = useMemo(() => {
    return selectedSwapResources.map((resource) => {
      return {
        ...resource,
        ...getResourceById(resource.resourceId),
      } as BankResource & ResourceQty;
    });
  }, [selectedSwapResources, getResourceById]);

  return {
    bankResources,
    availableResourceIds,
    selectedSwapResources,
    selectedSwapResourcesWithBalance,
    addSelectedSwapResources,
    removeSelectedSwapResource,
    removeAllSelectedSwapResources,
    updateSelectedSwapResourceQty,
    updateSelectedSwapResource,
    getResourceById,
    batchAddResources,
    historicPrices,
    isLordsApproved,
    setIsLordsApproved,
    isResourcesApproved,
    setIsResourcesApproved,
  };
}

export function useBankContext() {
  return useContext(BankContext);
}
