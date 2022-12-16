import {
  useAccount,
  useStarknetInvoke,
  useStarknetCall,
} from '@starknet-react/core';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import type { Contract } from 'starknet';
import { uint256, number } from 'starknet';
import { useBankContext } from '@/context/BankContext';
import { useCommandList } from '@/context/CommandListContext';
import {
  useLordsContract,
  useBuildingContract,
  useExchangeContract,
  useResources1155Contract,
  ModuleAddr as CM,
} from '@/hooks/settling/stark-contracts';
import type {
  CallAndMetadata,
  RealmsTransactionRenderConfig,
} from '@/types/index';

export const queryKeys = {
  isApproved: (operator: any) => ['desiege', 'token-approval', operator],
};

const ALLOWANCE_AMOUNT = ethers.utils.parseUnits('999999999999999', 18);
const MIN_ALLOWANCE_AMOUNT = ethers.utils.parseUnits('1000', 18);

const createApprovalParams = (contractAddress: string) => {
  return {
    args: [
      number.toBN(contractAddress).toString(),
      uint256.bnToUint256(ALLOWANCE_AMOUNT.toString()),
    ],
  };
};

const createStarknetAllowanceCall = (
  lordsContract: any,
  account: string,
  contractAddress: string
) => {
  return {
    contract: lordsContract,
    method: 'allowance',
    args: [
      number.toBN(account).toString(),
      number.toBN(contractAddress).toString(),
    ],
    options: { watch: false },
  };
};

const useApprovalForContract = (contract: Contract) => {
  const { address } = useAccount();
  const { isResourcesApproved, setIsResourcesApproved } = useBankContext();
  const { contract: lordsContract } = useLordsContract();
  const approveLordsAction = useStarknetInvoke({
    contract: lordsContract,
    method: 'approve',
  });

  const {
    data: outputResult,
    loading: outputLoading,
    error: outputError,
    refresh: refreshApproval,
  } = useStarknetCall(
    createStarknetAllowanceCall(
      lordsContract,
      address as string,
      contract?.address as string
    )
  );

  useEffect(() => {
    if (!outputResult) return;
    setIsResourcesApproved(
      uint256.uint256ToBN(outputResult['remaining']) >=
        number.toBN(MIN_ALLOWANCE_AMOUNT.toString())
    );
  }, [outputResult]);

  return {
    isApproved: isResourcesApproved,
    approveLords: () => {
      approveLordsAction.invoke(
        createApprovalParams(contract?.address as string)
      );
    },
  };
};

export const useApproveLordsForBuilding = () => {
  const { contract: buildingContract } = useBuildingContract();
  return useApprovalForContract(buildingContract as Contract);
};

export const useApproveLordsForExchange = () => {
  const { contract: exchangeContract } = useExchangeContract();
  return useApprovalForContract(exchangeContract as Contract);
};

export const useApproveResourcesForExchange = () => {
  const { address } = useAccount();
  const { contract: exchangeContract } = useExchangeContract();
  const { contract: resourcesContract } = useResources1155Contract();
  const { isLordsApproved, setIsLordsApproved } = useBankContext();

  const approveResourcesAction = useStarknetInvoke({
    contract: resourcesContract,
    method: 'setApprovalForAll',
  });

  const {
    data: outputResult,
    loading: outputLoading,
    error: outputError,
  } = useStarknetCall({
    contract: resourcesContract,
    method: 'isApprovedForAll',
    args: [
      number.toBN(address as string).toString(),
      exchangeContract?.address.toString(),
    ],
  });

  useEffect(() => {
    if (!outputResult) return;
    setIsLordsApproved(outputResult.toString() == '1');
  }, [outputResult]);

  const approveResources = () => {
    console.log(approveResourcesAction.error);
    approveResourcesAction.invoke({
      args: [
        number.toBN(exchangeContract?.address as string).toString(),
        number.toFelt(1),
      ],
    });
  };

  return { isApproved: isLordsApproved, approveResources };
};
// TODO should this be refactored to context so fetch not repeated
export const useDumbGameApprovals = () => {
  const { contract: resourcesContract } = useResources1155Contract();
  const { address } = useAccount();

  const [isGameApproved, setIsGameApproved] = useState<boolean>();
  const { data: realmsApprovalData } = useStarknetCall({
    contract: resourcesContract,
    method: 'isApprovedForAll',
    args: [
      number.toBN(address as string).toString(),
      number.toBN(CM.Building).toString(),
    ],
  });

  useEffect(() => {
    if (realmsApprovalData !== undefined && address !== undefined) {
      setIsGameApproved(realmsApprovalData.toString() === '1' ? true : false);
    }
  }, [realmsApprovalData, address]);

  return { isGameApproved };
};

export const getApproveAllGameContracts = (): CallAndMetadata[] => {
  const calls: CallAndMetadata[] = [];

  // Exchange approvals

  calls.push({
    contractAddress: CM.ResourcesToken,
    entrypoint: 'setApprovalForAll',
    calldata: [number.toBN(CM.Exchange).toString(), number.toFelt(1)],
    metadata: {
      title: 'Realm Resources Contract',
      description: 'Approve spending by Realms Exchange module',
      action: 'approve_exchange_resources',
    },
  });

  calls.push({
    contractAddress: CM.Lords,
    entrypoint: 'approve',
    calldata: [
      number.toBN(CM.Exchange).toString(),
      ALLOWANCE_AMOUNT.toString(),
      0, // Extra felt for uint256
    ],
    metadata: {
      title: 'Lords Contract',
      description: 'Approve spending by Realms Exchange module',
      action: 'approve_exchange_lords',
    },
  });

  calls.push({
    contractAddress: CM.ResourcesToken,
    entrypoint: 'setApprovalForAll',
    calldata: [number.toBN(CM.ResourceGame).toString(), number.toFelt(1)],
    metadata: {
      title: 'Realms Resources',
      description: 'Approve spending by Resource Game module',
      action: 'approve_game_resources',
    },
  });

  // Settling

  calls.push({
    contractAddress: CM.Realms,
    entrypoint: 'setApprovalForAll',
    calldata: [number.toBN(CM.Settling).toString(), number.toFelt(1)],
    metadata: {
      title: 'Realms NFT',
      description: 'Approve spending by Settling module',
      action: 'approve_settling_realms',
    },
  });

  // Buildings
  calls.push({
    contractAddress: CM.ResourcesToken,
    entrypoint: 'setApprovalForAll',
    calldata: [number.toBN(CM.Building).toString(), number.toFelt(1)],
    metadata: {
      title: 'Realms Resources Contract',
      description: 'Approve spending by Building module',
      action: 'approve_building_resources',
    },
  });

  // Combat

  calls.push({
    contractAddress: CM.ResourcesToken,
    entrypoint: 'setApprovalForAll',
    calldata: [number.toBN(CM.Combat).toString(), number.toFelt(1)],
    metadata: {
      title: 'Realm Resources Contract',
      description: 'Approve spending by Combat module',
      action: 'approve_combat_resources',
    },
  });

  // Combat

  calls.push({
    contractAddress: CM.ResourcesToken,
    entrypoint: 'setApprovalForAll',
    calldata: [number.toBN(CM.Food).toString(), number.toFelt(1)],
    metadata: {
      title: 'Food approval',
      description: 'Approve spending by Food Module',
      action: 'approve_food',
    },
  });

  return calls;
};

export const renderTransaction: RealmsTransactionRenderConfig = {
  ['approvals']: ({ metadata }, ctx) => ({
    title: metadata.title,
    description: 'Various contract approvals to interact with Eternum',
  }),
};
