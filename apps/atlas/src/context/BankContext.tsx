/* eslint-disable @typescript-eslint/no-empty-function */
import { parseEther } from '@ethersproject/units';
import { useAccount, useStarknetCall } from '@starknet-react/core';
import type { BigNumber } from 'ethers';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { number, uint256 } from 'starknet';
import {
  calculateLords,
  convertBalance,
  getIsBalanceSufficient,
  initResources,
  resourceMapping,
} from '@/components/bank/BankGetters';
import { resources, ResourcesIds } from '@/constants/resources';
import type { ExchangeRate } from '@/hooks/market/useMarketRate';
import { useMarketRate } from '@/hooks/market/useMarketRate';
import { useExchangeContract } from '@/hooks/settling/stark-contracts';
import { soundSelector, useUiSounds } from '@/hooks/useUiSounds';
import type { ResourceCost, HistoricPrices } from '@/types/index';
import { useUserBalancesContext } from './UserBalancesContext';

export type ResourceQty = {
  resourceId: number;
  qty: number;
};

export type UserLp = {
  lp: number;
};

const BankContext = createContext<{
  checkBalance: () => boolean;
  tokenIds: number[];
  tokenAmounts: BigNumber[];
  calculatedSlippage: number;
  calculatedTotalInLords: number;
  calculatedPriceInLords: number;
  slippage: number;
  setSlippage: (slippage: number) => void;
  tradeType: string;
  toggleTradeType: () => void;
  isBuy: boolean;
  isSell: boolean;
  bankResources: (ExchangeRate & UserLp)[];
  availableResourceIds: number[];
  selectedSwapResources: ResourceQty[];
  selectedSwapResourcesWithBalance: (ExchangeRate & ResourceQty & UserLp)[];
  addSelectedSwapResources: (resourceId?: number, qty?: number) => void;
  removeSelectedSwapResource: (resourceId: number) => void;
  removeAllSelectedSwapResources: () => void;
  updateSelectedSwapResourceQty: (resourceId: number, qty: number) => void;
  updateSelectedSwapResource: (
    resourceId: number,
    newResourceId: number
  ) => void;
  getResourceById: (resourceId: number) => (ExchangeRate & UserLp) | undefined;
  batchAddResources: (cost: ResourceCost[], clearCart?: boolean) => void;
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

const buy = 'buy';
const sell = 'sell';

function useResources() {
  const [tradeType, toggleTradeType] = useReducer(
    (state: typeof buy | typeof sell) => {
      return state === sell ? buy : sell;
    },
    buy
  );

  const isBuy = tradeType === buy;
  const isSell = tradeType === sell;

  const [slippage, setSlippage] = useState(0.05);
  const [isLordsApproved, setIsLordsApproved] = useState<boolean>(false);
  const [isResourcesApproved, setIsResourcesApproved] =
    useState<boolean>(false);
  const [bankResources, setBankResources] =
    useState<(ExchangeRate & UserLp)[]>(initResources);
  const [availableResourceIds, setAvailableResourceIds] = useState<number[]>(
    resources.map((resource) => resource.id)
  );
  const [selectedSwapResources, setSelectedSwapResources] = useState<
    ResourceQty[]
  >([]);

  const { address } = useAccount();
  const { contract: exchangeContract } = useExchangeContract();
  const { exchangeInfo, historicPrices } = useMarketRate();

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

  const { play: playAddWood } = useUiSounds(soundSelector.addWood);
  const { play: playAddStone } = useUiSounds(soundSelector.addStone);
  const { play: playAddAlchemicalSilver } = useUiSounds(
    soundSelector.addAlchemicalSilver
  );
  const { play: playAddWheat } = useUiSounds(soundSelector.addWheat);

  const playResourceSound = (resourceId) => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (resourceId) {
      case ResourcesIds.Wood:
        playAddWood();
        break;
      case ResourcesIds.Stone:
        playAddStone();
        break;
      case ResourcesIds.AlchemicalSilver:
        playAddAlchemicalSilver();
        break;
      case ResourcesIds.Wheat:
        playAddWheat();
        break;
      default:
        break;
    }
  };

  // batch add a cost
  const batchAddResources = (cost: ResourceCost[], clearCart = false) => {
    const mapped: ResourceQty[] = cost?.map((a) => {
      return {
        resourceId: a.resourceId,
        qty: a.amount * 1.05,
      };
    });

    const cartResources = clearCart ? [] : selectedSwapResources;
    const result: ResourceQty[] = Object.values(
      [...cartResources, ...mapped].reduce((acc, { resourceId, qty }) => {
        acc[resourceId] = {
          resourceId,
          qty: (acc[resourceId] ? acc[resourceId].qty : 0) + qty,
        };
        return acc;
      }, {})
    );

    setSelectedSwapResources([...result]);
  };

  const addSelectedSwapResources = (resourceId?: number, qty?: number) => {
    if (availableResourceIds.length === 0) {
      return;
    }
    const select = resourceId ?? availableResourceIds[0];
    playResourceSound(select);
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

    setBankResources(
      resources.map((resource, index) => {
        const resourceId = resource.id ?? 0;

        const rate = rates.find((rate) => rate.tokenId === resourceId);

        return {
          tokenName: rate?.tokenName ?? '0',
          tokenId: rate?.tokenId ?? 0,
          amount: rate?.amount ?? '0',
          buyAmount: rate?.buyAmount ?? '0',
          sellAmount: rate?.sellAmount ?? '0',
          lp: userLp[index]?.amount ?? '0',
          currencyReserve: rate?.currencyReserve ?? '0',
          tokenReserve: rate?.tokenReserve ?? '0',
          percentChange24Hr: rate?.percentChange24Hr ?? 0,
        };
      })
    );
  }, [lpBalanceData, exchangeInfo, selectedSwapResources]);

  const getResourceById = useCallback(
    (resourceId: number) => {
      return bankResources.find((resource) => resource.tokenId === resourceId);
    },
    [bankResources]
  );

  const selectedSwapResourcesWithBalance = useMemo(() => {
    return selectedSwapResources.map((resource) => {
      return {
        ...resource,
        ...getResourceById(resource.resourceId),
      } as ExchangeRate & ResourceQty & UserLp;
    });
  }, [selectedSwapResources, getResourceById]);

  const calculatedPriceInLords = useMemo(() => {
    return selectedSwapResourcesWithBalance.reduce((acc, resource) => {
      return (
        acc +
        calculateLords(
          isBuy ? resource.buyAmount : resource.sellAmount,
          resource.qty
        )
      );
    }, 0);
  }, [selectedSwapResourcesWithBalance, tradeType]);

  const calculatedSlippage = useMemo(() => {
    return isBuy
      ? calculatedPriceInLords * slippage
      : -(calculatedPriceInLords * slippage);
  }, [calculatedPriceInLords, slippage, tradeType]);

  const calculatedTotalInLords = useMemo(() => {
    return calculatedPriceInLords + calculatedSlippage;
  }, [calculatedPriceInLords, calculatedSlippage, tradeType]);

  const tokenIds = useMemo(() => {
    return selectedSwapResourcesWithBalance.map(
      (resource) => resource.resourceId
    );
  }, [selectedSwapResources]);

  const tokenAmounts = useMemo(() => {
    return selectedSwapResourcesWithBalance.map((resource) =>
      parseEther(String(resource.qty))
    );
  }, [selectedSwapResources]);

  const { lordsBalanceAfterCheckout } = useUserBalancesContext();

  const checkBalance = () => {
    const balance = convertBalance(lordsBalanceAfterCheckout);
    return getIsBalanceSufficient(balance, calculatedTotalInLords);
  };

  return {
    checkBalance,
    tokenIds,
    tokenAmounts,
    calculatedSlippage,
    calculatedTotalInLords,
    calculatedPriceInLords,
    slippage,
    setSlippage,
    tradeType,
    toggleTradeType,
    isBuy,
    isSell,
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
