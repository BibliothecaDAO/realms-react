import { useStarknetInvoke } from '@starknet-react/core';
import { BigNumber } from 'ethers';
import { useState, useEffect } from 'react';
import { toFelt } from 'starknet/dist/utils/number';
import { bnToUint256 } from 'starknet/dist/utils/uint256';
import { resources } from '@/util/resources';
import { useExchangeContract } from './settling/stark-contracts';

export type ResourceQty = {
  resourceId: number;
  qty: number;
};

export const useSwapResources = () => {
  const [loading, setLoading] = useState(false);
  const [availableResources, setAvailableResources] = useState<number[]>(
    resources.map((resource) => resource.id)
  );
  const [selectedResources, setSelectedResources] = useState<ResourceQty[]>([]);
  const { contract: exchangeContract } = useExchangeContract();
  const {
    data: buyTokensData,
    loading: buyTokensLoading,
    invoke: invokeBuyTokens,
    error: buyTokensError,
  } = useStarknetInvoke({
    contract: exchangeContract,
    method: 'buy_tokens',
  });

  const buyTokens = (
    maxAmount: BigNumber,
    tokenIds: number[],
    tokenAmounts: BigNumber[],
    deadline: number
  ) => {
    invokeBuyTokens({
      args: [
        bnToUint256(maxAmount.toHexString()),
        tokenIds.map((value) => bnToUint256(value)),
        tokenAmounts.map((value) =>
          bnToUint256(BigNumber.from(value).toHexString())
        ),
        toFelt(deadline),
      ],
    });
  };

  const addSelectedResources = () => {
    if (availableResources.length === 0) {
      return;
    }
    const resourceId = availableResources[0];
    setSelectedResources([...selectedResources, { resourceId, qty: 0 }]);
  };

  const removeSelectedResource = (resourceId: number) => {
    setSelectedResources(
      selectedResources.filter((item) => item.resourceId !== resourceId)
    );
  };

  const updateSelectedResource = (
    resourceId: number,
    newResourceId: number
  ) => {
    setSelectedResources(
      selectedResources.map((resource) => {
        if (resource.resourceId === resourceId) {
          return { ...resource, resourceId: newResourceId };
        }
        return resource;
      })
    );
  };
  const updateSelectedResourceQty = (resourceId: number, qty: number) => {
    setSelectedResources(
      selectedResources.map((resource) =>
        resource.resourceId === resourceId
          ? { ...resource, qty: qty }
          : { ...resource }
      )
    );
  };

  useEffect(() => {
    setAvailableResources(
      resources
        .map((resource) => resource.id)
        .filter(
          (resourceId) =>
            selectedResources.find(
              (resource) => resource.resourceId === resourceId
            ) === undefined
        )
    );
  }, [selectedResources]);
  return {
    loading,
    availableResources,
    selectedResources,
    addSelectedResources,
    removeSelectedResource,
    updateSelectedResourceQty,
    updateSelectedResource,
    buyTokens,
    buyTokensData,
    buyTokensLoading,
    buyTokensError,
  };
};
